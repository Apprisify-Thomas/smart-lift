import { WebSocket, WebSocketServer } from 'ws';
import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { askFloorManager } from './utils';
import path from 'path';
import { FLOORS_FILE } from './config';
import { FileAttachment, SocketAction } from './types';
import { processActions } from './actions';

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.use(express.json({ limit: '5mb' }));

let client: WebSocket;

const wsServer = new WebSocketServer({
  port: 8082,
});

const sendAction = (action: SocketAction) => {
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(action));
  } else {
    console.warn('No clients connected to receive the message');
  }
};

const sendUpdate = () => {
  var data = JSON.parse(fs.readFileSync(FLOORS_FILE).toString());
  sendAction({ type: 'floors:update', payload: data.floors });
};

wsServer.on('connection', (ws) => {
  console.log('Client connected');
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

  res.send('mail recieved and processed');
});

app.listen(8083, () => console.log('Server listening on port 8083'));

console.log(`Websocket is running on ws://localhost:${wsServer.options.port}`);
