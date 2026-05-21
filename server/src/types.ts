import { Floor } from '@client/types';

export type FloorData = {
  floors: Floor[];
};

export type SocketAction =
  | { type: 'floors:update'; payload: Floor[] }
  | { type: 'email:processing'; payload: { message: string } }
  | { type: 'email:processed'; payload: any };

export type AddCompanyAction = {
  type: 'ADD_COMPANY';
  floor: number;
  name: string;
  image: boolean;
  index: number | null;
};

export type UpdateCompanyAction = {
  type: 'UPDATE_COMPANY';
  findName: string;
  replaceWith: string;
  image: boolean;
  index: number | null;
};

export type DeleteCompanyAction = {
  type: 'DELETE_COMPANY';
  name: string;
};

export type ChangeImageAction = {
  type: 'CHANGE_IMAGE';
  companyName: string;
  shouldBeChanged: boolean;
};

export type MoveCompanyAction = {
  type: 'MOVE_COMPANY';
  name: string;
  toLevel: number;
};

export type AddEventBannerAction = {
  type: 'ADD_EVENT_BANNER';
  floor: number;
  title: string | null;
  description: string | null;
  fromDate: string | null;
  toDate: string | null;
};

export type UpdateEventBannerAction = {
  type: 'UPDATE_EVENT_BANNER';
  floor: number;
  title: string | null;
  description: string | null;
  fromDate: string | null;
  toDate: string | null;
};

export type RemoveEventBannerAction = {
  type: 'REMOVE_EVENT_BANNER';
  floor: number;
};

export type FloorAction =
  | AddCompanyAction
  | UpdateCompanyAction
  | DeleteCompanyAction
  | MoveCompanyAction
  | RemoveEventBannerAction
  | UpdateEventBannerAction
  | ChangeImageAction
  | AddEventBannerAction;

export type FileAttachment = {
  Content: string;
  ContentLength: number;
  Name: string;
  ContentType: string;
};
