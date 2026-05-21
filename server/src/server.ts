import { WebSocket, WebSocketServer } from 'ws';
import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { askFloorManager } from './utils';
import path from 'path';
import { FLOORS_FILE } from './config';
import { FileAttachment, SocketAction } from './types';
import { processActions } from './actions';
import { Floor } from '@client/types';

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.use(express.json({ limit: '5mb' }));

let client: WebSocket;

const wsServer = new WebSocketServer({
  port: 8082,
});

function prepareFloors(floors: Floor[]): Floor[] {
  return floors.map((f) => {
    if (f.eventBanner) {
      const now = new Date();
      const fromDate = f.eventBanner.fromDate ? new Date(f.eventBanner.fromDate) : null;
      const toDate = f.eventBanner.toDate ? new Date(f.eventBanner.toDate) : null;

      if ((fromDate && now < fromDate) || (toDate && now > toDate)) {
        delete f.eventBanner;
      }
    }

    return f;
  });
}

const sendAction = (action: SocketAction) => {
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(action));
  } else {
    console.warn('No clients connected to receive the message');
  }
};

const sendUpdate = () => {
  var data = JSON.parse(fs.readFileSync(FLOORS_FILE).toString());
  sendAction({ type: 'floors:update', payload: prepareFloors(data.floors) });
};

wsServer.on('connection', (ws) => {
  console.log('Client connected');

  // Just one client allowed
  client = ws;

  // Log errors
  ws.on('error', console.error);

  // Send initial update when a client connects
  sendUpdate();

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.post('/', async (req, res) => {
  sendAction({
    type: 'email:processing',
    payload: { message: 'Processing email...' },
  });

  const response = await askFloorManager(req.body.TextBody as string);

  console.log(response);

  await processActions(response.actions, req.body.Attachments as FileAttachment[]);

  sendAction({
    type: 'email:processed',
    payload: response,
  });

  sendUpdate();

  res.send('mail recieved and processed');
});

// Update client every 30 seconds in case of external changes to the floors data
setInterval(() => {
  sendUpdate();
}, 30000);

app.listen(8083, () => console.log('Server listening on port 8083'));

console.log(`Websocket is running on ws://localhost:${wsServer.options.port}`);
