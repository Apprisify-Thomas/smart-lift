import { FloorAction } from './types';
import { FloorManager } from './FloorManager';
import { EVENTS_FACTORY_FILE, EVENTS_FILE, FLOORS_FACTORY_FILE, FLOORS_FILE } from './config';
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
            ...(imageFile ? { logoUrl: imageFile } : {}),
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
            logoUrl: imageFile ? imageFile : '',
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
        eventManager.updateEvent(action.title, {
          ...action.update,
          ...(imageFile ? { imageUrl: imageFile } : {}),
        });
        eventManager.save();
        break;
      case 'SEND_STATUS':
      case 'REJECT':
        // No changes to be made, just send the current state of the floors + screenshot
        break;
      case 'UNDO':
        floorManager.loadLastRevision();
        eventManager.loadLastRevision();
        break;
      case 'RESET_TO_FACTORY':
        fs.copyFileSync(FLOORS_FACTORY_FILE, FLOORS_FILE);
        fs.copyFileSync(EVENTS_FACTORY_FILE, EVENTS_FILE);
    }
  }
}
