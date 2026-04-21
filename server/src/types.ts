import { Floor } from '@client/types';

export type FloorData = {
  floors: Floor[];
};

export type AddCompanyAction = {
  type: 'ADD_COMPANY';
  floor: number;
  name: string;
  image: boolean;
};

export type UpdateCompanyAction = {
  type: 'UPDATE_COMPANY';
  findName: string;
  replaceWith: string;
  image: boolean;
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

export type FloorAction =
  | AddCompanyAction
  | UpdateCompanyAction
  | DeleteCompanyAction
  | ChangeImageAction;
