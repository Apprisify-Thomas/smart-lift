import { Floor } from "@client/types";

export type FloorData = {
  floors: Floor[];
}

export type FloorAction = {
  actionType: 'UPDATE' | 'DELETE' | 'ADD';
  floor: number;
  companyName: string;
  replacedByName: string;
  image: boolean;
}