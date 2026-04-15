export type Floor = {
  num: number;
  companies: FloorCompany[];
}

export type FloorCompany = {
    name: string;
    description?: string;
    logo?: string;
}

export interface SocketAction {
  type: string;
  payload: any;
}