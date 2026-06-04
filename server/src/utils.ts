import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { OpenAIResponse } from './schema';
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

export async function askFloorManager(subject: string, action: string, userMailAddress: string) {
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
          Here is the current state of the building: ${JSON.stringify(
            floorsData
          )}. Try to be as precise as possible when identifying the company. If you are not sure if the user wants to change the image, ask them to clarify. Only change the image if they explicitly say so.

          Important: Do not allow more than 4 companies on each floor. Answer with a single REJECT action if a user wants to exceed this limit by adding or moving new companies. 
          
          There are events going on in the building. Here is the current state of all events: ${JSON.stringify(eventsData)}

          The current date and time is ${date.toISOString()}. Use this if the user asks for a update on events.

          The current User E-Mail is ${userMailAddress}

          Detailed description of allowed actions:
          'ADD_COMPANY': Adds a company to a specific floor and moves it to a index pos if needed. This index is for my splice function so it should be possible to move a company before and after a target company.
          'MOVE_COMPANY': Moves a company from one floor to another and removes the old one. Only use this action if the user specifies a target floor otherwise use the 'UPDATE_COMPANY' action for index movement. If no index is specified always append the company to the end of the companies array on the target floor.
          'DELETE_COMPANY': Removes a company name from all floors if found
          'UPDATE_COMPANY': Should update a company name or logo and its index position within the companies array. This index is for my splice function so it should be possible to move a company before and after a target company.
          'UPDATE_EVENT': If there is an existing event and for example the timing needs to be adjusted use this action.
          'REMOVE_EVENT': Should remove the event entirely. Only use if the user explicitly says so.
          'SEND_STATUS': This is a special action that should be used if the user wants see the current state of the floors without making any changes. 
          'RESET_TO_FACTORY': This is a special action that should be used if the user wants to reset all floors and events to the factory state. Only use this action if the user explicitly says so.
          'REJECT': Reject if a user wants to MOVE or ADD a company to a non existing floor number or if they want to update an event that does not exist. If the user wants to MOVE or ADD a company but does not specify the target floor number, the feedback message could be "To which floor do you want to move the company?" 

          For every action please provide a short feedback message in HTML(please wrap everything in HTML Tags) that I can directly send to the user. This should be a short confirmation of the action that was performed. For example if the user wants to move a company to another floor the feedback message could be "Company X was moved to floor Y". If the user just wants to see the current state of the floors without making any changes, the feedback message could be "Current state of the floors sent". 
          Always provide a feedback message for every action and use the language of the user. Try to formulate as human-like as possible. Try to not use words like "removed", "added", "updated.
          Please use a salutation with parts of the user email and add a closing line/sign-off as "Lift Manager". Newlines after the salutation and the message body.
          `,
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `Subject: ${subject}; ActionText: ${action}`,
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(OpenAIResponse, 'response'),
    },
  });

  return JSON.parse(response.output_text) as { actions: FloorAction[]; feedbackMessage: string };
}

export async function saveImage(file: FileAttachment) {
  const hash = crypto.createHash('sha256').update(file.contentBytes).digest('hex');

  const fileName = hash + '.png';
  const filePath = `./public/files/${fileName}`;

  if (fs.existsSync(filePath)) {
    console.log('File exists');
    return `http://localhost:8083/files/${fileName}`;
  }

  const buffer = Buffer.from(file.contentBytes, 'base64');
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height || !metadata.channels) {
    throw new Error('Invalid input image metadata');
  }

  await image.png().toFile(filePath);

  console.log('File created');
  return `http://localhost:8083/files/${fileName}`;
}
