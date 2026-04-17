import { Floor } from "@client/types";

export type FloorData = {
  floors: Floor[];
}

export type AddCompanyAction = {
  type: 'ADD';
  floor: number;
  companyName: string;
  image: boolean;
}

export type UpdateCompanyAction = {
  type: 'UPDATE';
  findName: string;
  replaceWith: string;
  image: boolean;
}

export type DeleteCompanyAction = {
  type: 'DELETE';
  name: string;
}

export type MoveCompanyAction = {
  type: 'MOVE';
  name: string;
  fromFloor: number;
  toFloor: number;
}

export type ChangeImageAction = {
  type: 'CHANGE_IMAGE';
  companyName: string;
  shouldBeChanged: boolean;
}

export type FloorAction = AddCompanyAction | UpdateCompanyAction | DeleteCompanyAction | MoveCompanyAction | ChangeImageAction;