import { FileAttachment, FloorAction } from './types';
import { saveImage, writeFloorsFile } from './utils';

export async function processActions(actions: FloorAction[], attachments: FileAttachment[]) {
  let imageFile = '';

  if (attachments[0] && attachments[0].Content) {
    imageFile = await saveImage(attachments[0]);
  }

  for (const action of actions) {
    switch (action.type) {
      case 'CHANGE_IMAGE':
        writeFloorsFile((data) => {
          data.floors = data.floors.map((f) => {
            const foundIndex = f.companies.findIndex((c) =>
              c.name.toLowerCase().includes(action.companyName.toLowerCase())
            );

            if (foundIndex >= 0) {
              if (action.shouldBeChanged) {
                f.companies[foundIndex].logo = imageFile;
              } else {
                f.companies[foundIndex].logo = '';
              }
            }

            return f;
          });

          return data;
        });
        break;
      case 'UPDATE_COMPANY':
        // Update company action
        writeFloorsFile((data) => {
          data.floors = data.floors.map((f) => {
            const foundIndex = f.companies.findIndex((c) =>
              c.name.toLowerCase().includes(action.findName.toLowerCase())
            );

            if (foundIndex >= 0) {
              f.companies[foundIndex] = {
                ...f.companies[foundIndex],
                name: action.replaceWith ? action.replaceWith : f.companies[foundIndex].name,
                //logo: action.image ? imageFile : ""
              };

              if (action.image !== null) {
                f.companies[foundIndex].logo = action.image ? imageFile : '';
              }
            }

            return f;
          });

          return data;
        });
        break;
      case 'ADD_COMPANY':
        // Add company action
        writeFloorsFile((data) => {
          data.floors = data.floors.map((f) => {
            if (action.floor !== 0 && action.floor === f.num) {
              f.companies.push({ name: action.name, logo: action.image ? imageFile : '' });
            }

            return f;
          });

          return data;
        });
        break;
      case 'DELETE_COMPANY':
        // Delete company action
        writeFloorsFile((data) => {
          data.floors = data.floors.map((f) => {
            f.companies = f.companies.filter(
              (c) => !c.name.toLowerCase().includes(action.name.toLowerCase())
            );

            return f;
          });

          return data;
        });
    }
  }
}
