import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { ActionSequence } from './schema';
import fs from 'fs';
import crypto from 'crypto';
import { FloorAction, FloorData } from './types';
import { FLOORS_FILE } from './config';

const openAIClient = new OpenAI({
  apiKey: process.env.OPEN_AI_APIKEY,
});

export async function askFloorManager(command: string) {
  var data = JSON.parse(fs.readFileSync(FLOORS_FILE).toString());

  const response = await openAIClient.responses.create({
    model: 'gpt-4o-mini',
    input: [
      {
        role: 'system',
        content: `Act as a floor UI manager. The user is allowed to rename a company on a specific floor, 
          update a company name, delete or add a new company. This should result in a action sequence.
          Company names should not be modified. If the user wants to change the image of a company, you should only change the image if the user explicitly says so.
          The building has ${data.floors.length} floors. Here is the current state of the building: ${JSON.stringify(
            data
          )}. Try to be as precise as possible when identifying the company. If you are not sure if the user wants to change the image, ask them to clarify. Only change the image if they explicitly say so.`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: command,
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(ActionSequence, 'actions'),
    },
  });

  return JSON.parse(response.output_text) as { actions: FloorAction[] };
}

export function writeFloorsFile(writer: (data: FloorData) => FloorData) {
  var data = JSON.parse(fs.readFileSync(FLOORS_FILE).toString());
  fs.writeFileSync(FLOORS_FILE, JSON.stringify(writer(data)));
}

export function saveImage(base64Image: string) {
  const hash = crypto.createHash('sha256').update(base64Image).digest('hex');

  const fileName = hash + '.png';
  const filePath = `./public/files/${fileName}`;

  if (fs.existsSync(filePath)) {
    console.log('File exists');
    return `http://localhost:8083/files/${fileName}`;
  }

  fs.writeFile(filePath, base64Image, { encoding: 'base64' }, function () {
    console.log('File created');
  });

  return `http://localhost:8083/files/${fileName}`;
}
