import { z } from 'zod';

export const AddCompanyAction = z.object({
  type: z.literal('ADD_COMPANY'),
  floor: z.number(),
  name: z.string(),
  image: z.boolean(),
  index: z.number().nullable(),
});

export const DeleteCompanyAction = z.object({
  type: z.literal('DELETE_COMPANY'),
  name: z.string(),
});

export const UpdateCompanyAction = z.object({
  type: z.literal('UPDATE_COMPANY'),
  findName: z.string(),
  replaceWith: z.string(),
  image: z.boolean().nullable(),
  index: z.number().nullable(),
});

export const MoveCompanyAction = z.object({
  type: z.literal('MOVE_COMPANY'),
  name: z.string(),
  toLevel: z.number(),
});

export const AddEventBannerAction = z.object({
  type: z.literal('ADD_EVENT_BANNER'),
  floor: z.number(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  fromDate: z.string().nullable(),
  toDate: z.string().nullable(),
});

export const UpdateEventBannerAction = z.object({
  type: z.literal('UPDATE_EVENT_BANNER'),
  floor: z.number(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  fromDate: z.string().nullable(),
  toDate: z.string().nullable(),
});

export const RemoveEventBannerAction = z.object({
  type: z.literal('REMOVE_EVENT_BANNER'),
  floor: z.number(),
});

export const SendStatusAction = z.object({
  type: z.literal('SEND_STATUS'),
});

export const Actions = z.union([
  AddCompanyAction,
  UpdateCompanyAction,
  DeleteCompanyAction,
  MoveCompanyAction,
  AddEventBannerAction,
  RemoveEventBannerAction,
  UpdateEventBannerAction,
  SendStatusAction,
]);

export const ActionSequence = z.object({
  actions: z.array(Actions),
});
