import { FloorAction } from './types';
import { FloorManager } from './FloorManager';
import { EVENTS_FILE, FLOORS_FILE } from './config';
import fs from 'fs';
import { FloorEventManager } from './FloorEventManager';

export async function processActions(actions: FloorAction[], imageFile?: string) {
  const floorManager = new FloorManager(FLOORS_FILE);
  const eventManager = new FloorEventManager(EVENTS_FILE);

  for (const action of actions) {
    switch (action.type) {
      case 'UPDATE_COMPANY':
        floorManager.updateCompany(
          action.findName,
          {
            name: action.replaceWith,
            ...(action.image ? { logoUrl: imageFile } : {}),
          },
          action.index
        );
        floorManager.save();

        break;
      case 'ADD_COMPANY':
        floorManager.addCompanyToFloor(
          action.floor,
          {
            name: action.name,
            logoUrl: action.image ? imageFile : '',
          },
          action.index
        );
        floorManager.save();
        break;
      case 'DELETE_COMPANY':
        floorManager.removeCompanyByName(action.name);
        floorManager.save();
        break;
      case 'MOVE_COMPANY':
        floorManager.moveCompanyToFloor(action.name, action.toLevel);
        floorManager.save();
        break;
      case 'ADD_EVENT':
        eventManager.addEvent({
          title: action.title,
          description: action.description ?? undefined,
          imageUrl: imageFile,
          fromDate: action.fromDate ?? undefined,
          toDate: action.toDate ?? undefined,
        });
        eventManager.save();
        break;
      case 'REMOVE_EVENT':
        eventManager.removeEvent(action.eventTitle);
        eventManager.save();
        break;
      case 'UPDATE_EVENT':
        eventManager.updateEvent(action.title, action.update);
        eventManager.save();
        break;
      case 'SEND_STATUS':
        // No changes to be made, just send the current state of the floors + screenshot
        break;
      case 'RESET_TO_FACTORY':
        fs.copyFileSync('./floors.factory.json', FLOORS_FILE);
        fs.copyFileSync('./events.factory.json', EVENTS_FILE);
    }
  }
}
