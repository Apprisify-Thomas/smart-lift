import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { ActionSequence } from './schema';
import fs from 'fs';
import sharp from 'sharp';
import crypto from 'crypto';
import { FileAttachment, FloorAction } from './types';
import { EVENTS_FILE, FLOORS_FILE } from './config';

const openAIClient = new OpenAI({
  apiKey: process.env.OPEN_AI_APIKEY,
});

export function getLocalISODate(): Date {
  const tzOffset = new Date().getTimezoneOffset() * 60000; // Offset in Millisekunden

  return new Date(Date.now() - tzOffset);
}

export async function askFloorManager(command: string) {
  const floorsData = JSON.parse(fs.readFileSync(FLOORS_FILE).toString());
  const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE).toString());
  const date = getLocalISODate();

  const response = await openAIClient.responses.create({
    model: 'gpt-4o-mini',
    input: [
      {
        role: 'system',
        content: `Act as a floor UI manager. The user is allowed to rename a company on a specific floor, 
          update a company name, delete or add a new company. This should result in a action sequence. If the user wants to change the image of a company, you should only change the image if the user explicitly says so.
          The building has ${floorsData.floors.length} floors. Here is the current state of the building: ${JSON.stringify(
            floorsData
          )}. Try to be as precise as possible when identifying the company. If you are not sure if the user wants to change the image, ask them to clarify. Only change the image if they explicitly say so.
          
          There are events going on in the building. Here is the current state of all events: ${JSON.stringify(eventsData)}

          The current date and time is ${date.toISOString()}. Use this if the user asks for a update on events.

          Detailed description of allowed actions:
          'ADD_COMPANY': Adds a company to a specific floor and moves it to a index pos if needed. This index is for my splice function so it should be possible to move a company before and after a target company.
          'MOVE_COMPANY': Moves a company from one floor to another and removes the old one. Only use this action if the user specifies a target floor otherwise use the 'UPDATE_COMPANY' action for index movement
          'DELETE_COMPANY': Removes a company name from all floors if found
          'UPDATE_COMPANY': Should update a company name or logo and its index position within the companies array. This index is for my splice function so it should be possible to move a company before and after a target company.
          'UPDATE_EVENT': If there is an existing event and for example the timing needs to be adjusted use this action.
          'REMOVE_EVENT': Should remove the event entirely. Only use if the user explicitly says so.
          'SEND_STATUS': This is a special action that should be used if the user wants see the current state of the floors without making any changes. 
          `,
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

export async function saveImage(file: FileAttachment) {
  const hash = crypto.createHash('sha256').update(file.Content).digest('hex');

  const fileName = hash + '.png';
  const filePath = `./public/files/${fileName}`;

  if (fs.existsSync(filePath)) {
    console.log('File exists');
    return `http://localhost:8083/files/${fileName}`;
  }

  const buffer = Buffer.from(file.Content, 'base64');
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height || !metadata.channels) {
    throw new Error('Invalid input image metadata');
  }

  await image.png().toFile(filePath);

  console.log('File created');
  return `http://localhost:8083/files/${fileName}`;
}
