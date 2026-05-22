import { WebSocket, WebSocketServer } from 'ws';
import { FLOORS_FILE } from './config';
import fs from 'fs';
import { SocketAction } from './types';
import { Floor } from '@client/types';

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

    const updatedFloors = data.floors.map((f) => {
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

    this.sendAction({ type: 'floors:update', payload: updatedFloors }, client);
  }

  listenForConnections() {
    this.server.on('connection', (ws) => {
      console.log('Client connected');

      // Log errors
      ws.on('error', console.error);

      // Send initial update when a client connects
      this.sendFloorsUpdate(ws);

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

    console.log(`Websocket is running on ws://localhost:${this.server.options.port}`);
  }
}
