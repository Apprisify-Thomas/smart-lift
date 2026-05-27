import { WebSocket, WebSocketServer } from 'ws';
import { EVENTS_FILE, FLOORS_FILE } from './config';
import fs from 'fs';
import { SocketAction } from './types';
import { Floor, FloorEvent } from '@client/types';
import { getLocalISODate } from './utils';

export class LiftSocket {
  private server: WebSocketServer;

  constructor(port: number = 8082) {
    this.server = new WebSocketServer({
      port,
    });
  }

  sendAction(action: SocketAction, client?: WebSocket) {
    const clients = this.server.clients || [client];

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(action));
      }
    }
  }

  sendFloorsUpdate(client?: WebSocket) {
    var data = JSON.parse(fs.readFileSync(FLOORS_FILE).toString()) as { floors: Floor[] };
    this.sendAction({ type: 'floors:update', payload: data.floors }, client);
  }

  sendEventsUpdate(client?: WebSocket) {
    const data = JSON.parse(fs.readFileSync(EVENTS_FILE).toString()) as { events: FloorEvent[] };
    const now = getLocalISODate();

    const filteredEvents = data.events.filter((e) => {
      const fromDate = e.fromDate ? new Date(e.fromDate) : null;
      const toDate = e.toDate ? new Date(e.toDate) : null;

      if ((fromDate && now < fromDate) || (toDate && now > toDate)) {
        return false;
      }

      return true;
    });

    this.sendAction({ type: 'events:update', payload: filteredEvents }, client);
  }

  sendUpdate(client?: WebSocket) {
    this.sendFloorsUpdate(client);
    this.sendEventsUpdate(client);
  }

  listenForConnections() {
    this.server.on('connection', (ws) => {
      console.log('Client connected');

      // Log errors
      ws.on('error', console.error);

      // Send initial update when a client connects
      this.sendUpdate(ws);

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

    console.log(`Websocket is running on ws://localhost:${this.server.options.port}`);
  }
}
