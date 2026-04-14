export type Floor = {
  num: number;
  companies: FloorCompany[];
}

export type FloorCompany = {
    name: string;
    description?: string;
    logo?: string;
}

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