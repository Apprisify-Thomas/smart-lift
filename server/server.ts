import { WebSocketServer } from "ws";
import express from "express";
import OpenAI from "openai";
import fs from "fs";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import fileUpload from "express-fileupload";

const floorsFile = "./floors.json";

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

const app = express();

app.use(fileUpload());
//app.use(formData.parse(options));

const wsServer = new WebSocketServer({
  port: 8082,
});

wsServer.on("connection", (ws) => {
  console.log("Client connected");

  const sendFloorUpdate = () => {
    var data = JSON.parse(fs.readFileSync(floorsFile).toString());
    ws.send(JSON.stringify({ type: "floors:update", payload: data.floors }));
  };

  ws.on("error", console.error);

  sendFloorUpdate();

  fs.watch(floorsFile, () => {
    sendFloorUpdate();
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

app.post("/modify", async (req, res) => {
  if (req.files && Object.keys(req.files).length !== 0) {
    console.log("there are files");
    const uploadedFile = req.files["file"];

    //const uploadPath = path.join("./files", uploadedFile.name);

    // uploadedFile.mv(uploadPath, (err) => {
    //   if (err) return res.status(500).send(err);
    //   res.send("Datei gespeichert");
    // });
  }

  await modifyFloorsData(floorsFile, req.body.message);

  res.send("modified");
});

app.listen(8083, () => {
  console.log("Server listening on port 8083");
});

async function modifyFloorsData(filePath: string, message: string) {
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
