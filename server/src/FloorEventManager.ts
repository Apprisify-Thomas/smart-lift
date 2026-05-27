import { FloorEvent } from '@client/types';
import fs from 'fs';

export class FloorEventManager {
  private events: FloorEvent[] = [];

  constructor(private file: string) {
    this.read();
  }

  addEvent(event: FloorEvent) {
    this.events.push(event);
  }

  updateEvent(title: string, event: Partial<FloorEvent>) {
    this.events = this.events.map((e) => {
      if (e.title.toLowerCase().includes(title.toLowerCase())) {
        return {
          ...e,
          ...(event.title ? { title: event.title } : {}),
          ...(event.description ? { description: event.description } : {}),
          ...(event.floor ? { floor: event.floor } : {}),
          ...(event.imageUrl ? { imageUrl: event.imageUrl } : {}),
          ...(event.fromDate ? { fromDate: event.fromDate } : {}),
          ...(event.toDate ? { toDate: event.toDate } : {}),
        };
      }

      return e;
    });
  }

  removeEvent(title: string) {
    this.events = this.events.filter((e) => !e.title.toLowerCase().includes(title.toLowerCase()));
  }

  read(): void {
    const data = JSON.parse(fs.readFileSync(this.file).toString());
    this.events = data.events;
  }

  save(): void {
    fs.writeFileSync(this.file, JSON.stringify({ events: this.events }));
  }
}
