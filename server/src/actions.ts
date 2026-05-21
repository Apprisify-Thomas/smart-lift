import { FileAttachment, FloorAction } from './types';
import { saveImage } from './utils';
import { Building } from './Building';
import { FLOORS_FILE } from './config';

export async function processActions(actions: FloorAction[], attachments: FileAttachment[]) {
  const building = new Building(FLOORS_FILE);

  let imageFile = '';

  if (attachments[0] && attachments[0].Content) {
    imageFile = await saveImage(attachments[0]);
  }

  for (const action of actions) {
    switch (action.type) {
      case 'UPDATE_COMPANY':
        building.updateCompany(
          action.findName,
          {
            name: action.replaceWith,
            ...(action.image ? { logoUrl: imageFile } : {}),
          },
          action.index
        );
        building.save();
        break;
      case 'ADD_COMPANY':
        building.addCompanyToFloor(
          action.floor,
          {
            name: action.name,
            logoUrl: action.image ? imageFile : '',
          },
          action.index
        );
        building.save();
        break;
      case 'DELETE_COMPANY':
        building.removeCompanyByName(action.name);
        building.save();
        break;
      case 'MOVE_COMPANY':
        building.moveCompanyToFloor(action.name, action.toLevel);
        building.save();
        break;
    }
  }
}
