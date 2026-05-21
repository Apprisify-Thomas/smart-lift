import { FileAttachment, FloorAction } from './types';
import { saveImage } from './utils';
import { FloorManager } from './FloorManager';
import { FLOORS_FILE } from './config';

export async function processActions(actions: FloorAction[], attachments: FileAttachment[]) {
  const floorManager = new FloorManager(FLOORS_FILE);

  let imageFile = '';

  if (attachments[0] && attachments[0].Content) {
    imageFile = await saveImage(attachments[0]);
  }

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
      case 'ADD_EVENT_BANNER':
        floorManager.addEventBannerToFloor(action.floor, {
          title: action.title ?? undefined,
          description: action.description ?? undefined,
          imageUrl: imageFile,
          fromDate: action.fromDate ?? undefined,
          toDate: action.toDate ?? undefined,
        });
        floorManager.save();
        break;
      case 'REMOVE_EVENT_BANNER':
        floorManager.removeEventBannerFromFloor(action.floor);
        floorManager.save();
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
        break;
    }
  }
}
