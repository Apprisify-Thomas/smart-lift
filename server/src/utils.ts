import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { InterpretedAction } from "./schema";
import fs from "fs";
import crypto from "crypto";
import { FloorAction, FloorData } from "./types";
import { FLOORS_FILE } from "./config";

const openAIClient = new OpenAI({
  apiKey: process.env.OPEN_AI_APIKEY,
});

export async function askFloorManager(command: string) {
  const response = await openAIClient.responses.create({
    model: "gpt-4o-mini",
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

  return JSON.parse(response.output_text) as FloorAction;
}



export function writeFloorsFile(writer: (data: FloorData) => FloorData) {
  var data = JSON.parse(fs.readFileSync(FLOORS_FILE).toString());
  fs.writeFileSync(FLOORS_FILE, JSON.stringify(writer(data)));
}

export function saveImage(base64Image: string) {
    const hash = crypto
    .createHash('sha256')
    .update(base64Image)
    .digest('hex');

  const fileName = hash + ".png";
  const filePath = `./public/files/${fileName}`;

  if(fs.existsSync(filePath)) {
    console.log('File exists');
    return `/files/${fileName}`;
  }

  fs.writeFile(filePath, base64Image, { encoding: 'base64' }, function() {
    console.log('File created');
  });

  return `/files/${fileName}`;
}