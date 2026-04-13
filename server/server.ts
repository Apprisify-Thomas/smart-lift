import { WebSocketServer } from "ws";
import express from "express";
import OpenAI from "openai";
import fs from "fs";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import cors from "cors";
import crypto from "crypto";

const FLOORS_FILE = "./floors.json";

const openAIClient = new OpenAI({
  apiKey: process.env.OPEN_AI_APIKEY,
});

const FloorsSchema = z.object({
  floors: z.array(
    z.object({
      num: z.number(),
      companies: z.array(
        z.object({
          name: z.string(),
          logo: z.string(),
        }),
      ),
    }),
  ),
});

interface FloorAction {
  actionType: 'UPDATE' | 'DELETE' | 'ADD';
  floor: number;
  companyName: string;
  replacedByName: string;
  image: boolean;
}

const ActionType = z.union([
  z.literal('UPDATE'),
  z.literal('DELETE'),
  z.literal('ADD'),
]);

const InterpretedAction = z.object({
  actionType: ActionType,
  floor: z.number(),
  companyName: z.string(),
  replacedByName: z.string(),
  image: z.boolean()
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const wsServer = new WebSocketServer({
  port: 8082,
});

wsServer.on("connection", (ws) => {
  console.log("Client connected");

  const sendFloorUpdate = () => {
    var data = JSON.parse(fs.readFileSync(FLOORS_FILE).toString());
    ws.send(JSON.stringify({ type: "floors:update", payload: data.floors }));
  };

  ws.on("error", console.error);

  sendFloorUpdate();

  fs.watch(FLOORS_FILE, () => {
    sendFloorUpdate();
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const exampleMail = {
  FromName: 'Thomas Monzel',
  MessageStream: 'inbound',
  From: 'thomas.monzel@apprisify.com',
  FromFull: {
    Email: 'thomas.monzel@apprisify.com',
    Name: 'Thomas Monzel',
    MailboxHash: ''
  },
  TextBody: 'Bitte füge die Firma Google ein mit dem Logo im Anhang auf Etage 2\n',
  Attachments: [{ Content: "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" }]
}

function saveImage(base64Image: string) {
  const fileName = crypto.randomUUID() + ".png";

  fs.writeFile(`./files/${fileName}`, base64Image, { encoding: 'base64' }, function() {
    console.log('File created');
  });

  return fileName;
}

app.post("/", async(req, res) => {
  const message = req.body.TextBody as string;
  const attachments = req.body.Attachments as { Content: string }[];

  for(const attachment of attachments) {
    //console.log(saveImage(attachment.Content));
  }

  const answer = await askFloorManager(message);
  
  const action = JSON.parse(answer) as FloorAction;

  switch(action.actionType) {
    case 'UPDATE':
      // Do update action  
    break;
    case 'ADD':
      // Do add action
      break;
    case 'DELETE':
      // Do delete action
  }

  res.send("email recieved");
});

app.listen(8083, () => {
  console.log("Server listening on port 8083");
});

async function askFloorManager(command: string) {

  const response = await openAIClient.responses.create({
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content:
          `Act as a floor UI manager. It is allowed for the user to rename a company in a specific floor. The user can also delete or add a new company`,
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: command,
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(InterpretedAction, "action"),
    },
  });

  return response.output_text;
}

async function modifyFloorsData(filePath: string, message: string, dataUri?: string) {
  const fileStream = fs.createReadStream(filePath);
  const file = await openAIClient.files.create({
    file: fileStream,
    purpose: "user_data",
  });

  const response = await openAIClient.responses.create({
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content:
          "Modify the given json input file and respond with the correct output",
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
          {
            type: "input_file",
            file_id: file.id,
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(FloorsSchema, "floors"),
    },
  });

  fs.writeFileSync(filePath, response.output_text);
  return response.output_text;
}

console.log(`Websocket is running on ws://localhost:${wsServer.options.port}`);
