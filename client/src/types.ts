export type Floor = {
  num: number;
  companies: FloorCompany[];
};

export type FloorEvent = {
  floor?: number;
  title: string;
  description?: string;
  fromDate?: string;
  toDate?: string;
  imageUrl?: string;
};

export type FloorCompany = {
  name: string;
  description?: string;
  logoUrl?: string;
};

export interface SocketAction {
  type: string;
  payload: any;
}
