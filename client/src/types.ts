export type Floor = {
  num: number;
  companies: FloorCompany[];
  eventBanner?: FloorEventBanner;
};

export type FloorEventBanner = {
  imageUrl: string;
  title?: string;
  description?: string;
  fromDate?: string;
  toDate?: string;
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
