import { FloorAction } from './types';
import { FloorManager } from './FloorManager';
import { FLOORS_FILE } from './config';
import { sendResponseEmail } from './mail';

export async function processActions(actions: FloorAction[], imageFile?: string) {
  const floorManager = new FloorManager(FLOORS_FILE);

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
      case 'ADD_EVENT_BANNER':
        floorManager.addEventBannerToFloor(action.floor, {
          title: action.title ?? undefined,
          description: action.description ?? undefined,
          imageUrl: imageFile,
          fromDate: action.fromDate ?? undefined,
          toDate: action.toDate ?? undefined,
        });
        floorManager.save();

        await sendResponseEmail(
          'Smart Lift / Banner added',
          `<p>This is an response to your ui update.</p>`,
          true
        );
        break;
      case 'REMOVE_EVENT_BANNER':
        floorManager.removeEventBannerFromFloor(action.floor);
        floorManager.save();

        await sendResponseEmail(
          'Smart Lift / Banner removed',
          `<p>You will find the current display state attached.</p>`,
          true
        );
        break;
      case 'UPDATE_EVENT_BANNER':
        floorManager.updateEventBanner(action.floor, {
          ...(action.title ? { title: action.title } : {}),
          ...(action.description ? { description: action.description } : {}),
          ...(imageFile ? { imageUrl: imageFile } : {}),
          ...(action.fromDate ? { fromDate: action.fromDate } : {}),
          ...(action.toDate ? { toDate: action.toDate } : {}),
        });
        floorManager.save();

        await sendResponseEmail(
          'Smart Lift / Banner updated',
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
    }
  }
}
