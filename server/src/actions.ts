import { FloorAction } from './types';
import { FloorManager } from './FloorManager';
import { EVENTS_FILE, FLOORS_FILE } from './config';
import { sendResponseEmail } from './mail';
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

        await sendResponseEmail(
          'Smart Lift / Company updated',
          `<p>This is an response to your ui update.</p>`,
          true
        );
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

        await sendResponseEmail(
          'Smart Lift / Company added',
          `<p>This is an response to your ui update.</p>`,
          true
        );
        break;
      case 'DELETE_COMPANY':
        floorManager.removeCompanyByName(action.name);
        floorManager.save();

        await sendResponseEmail(
          'Smart Lift / Company deleted',
          `<p>This is an response to your ui update.</p>`,
          true
        );
        break;
      case 'MOVE_COMPANY':
        floorManager.moveCompanyToFloor(action.name, action.toLevel);
        floorManager.save();

        await sendResponseEmail(
          'Smart Lift / Company moved',
          `<p>This is an response to your ui update.</p>`,
          true
        );
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

        await sendResponseEmail(
          'Smart Lift / Event added',
          `<p>This is an response to your ui update.</p>`,
          true
        );
        break;
      case 'REMOVE_EVENT':
        eventManager.removeEvent(action.eventTitle);
        eventManager.save();

        await sendResponseEmail(
          'Smart Lift / Event removed',
          `<p>You will find the current display state attached.</p>`,
          true
        );
        break;
      case 'UPDATE_EVENT':
        eventManager.updateEvent(action.title, action.update);
        eventManager.save();

        await sendResponseEmail(
          'Smart Lift / Event updated',
          `<p>You will find the current display state attached.</p>`,
          true
        );
        break;
      case 'SEND_STATUS':
        // No changes to be made, just send the current state of the floors + screenshot
        await sendResponseEmail(
          'Smart Lift / Status update',
          `<pre>${JSON.stringify({ floors: floorManager.getFloors() }, null, 2)}</pre>`,
          true
        );
        break;
      case 'RESET_TO_FACTORY':
        fs.copyFileSync('./floors.factory.json', FLOORS_FILE);
        fs.copyFileSync('./events.factory.json', EVENTS_FILE);

        await sendResponseEmail(
          'Smart Lift / Reset',
          `Das Lift UI wurde auf den Ursprungsstand zurückgesetzt.`,
          true
        );
    }
  }
}
