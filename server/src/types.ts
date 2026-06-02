import { Floor, FloorEvent } from '@client/types';

export type FloorData = {
  floors: Floor[];
};

export type MailBodyData = {
  From: string;
  Subject: string;
  TextBody: string;
  Attachments: FileAttachment[];
};

export type SocketAction =
  | { type: 'floors:update'; payload: Floor[] }
  | { type: 'events:update'; payload: FloorEvent[] }
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

export type AddEventAction = {
  type: 'ADD_EVENT';
  floor?: number;
  title: string;
  description?: string;
  fromDate?: string;
  toDate?: string;
};

export type UpdateEventAction = {
  type: 'UPDATE_EVENT';
  title: string;
  update: Partial<FloorEvent>;
};

export type RemoveEventAction = {
  type: 'REMOVE_EVENT';
  eventTitle: string;
};

export type ResetAction = {
  type: 'RESET_TO_FACTORY';
};

export type SendStatusAction = {
  type: 'SEND_STATUS';
};

export type FloorAction =
  | AddCompanyAction
  | UpdateCompanyAction
  | DeleteCompanyAction
  | MoveCompanyAction
  | RemoveEventAction
  | UpdateEventAction
  | ChangeImageAction
  | AddEventAction
  | SendStatusAction
  | ResetAction;

export type FileAttachment = {
  id: string;
  name: string;
  lastModifiedDateTime: string;
  size: number;
  isInline: boolean;
  contentType: string;
  contentBytes: string;
};
