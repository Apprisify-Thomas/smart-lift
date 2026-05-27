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
  image: z.boolean().nullish(),
  index: z.number().nullish(),
});

export const MoveCompanyAction = z.object({
  type: z.literal('MOVE_COMPANY'),
  name: z.string(),
  toLevel: z.number(),
});

export const AddEventAction = z.object({
  type: z.literal('ADD_EVENT'),
  floor: z.number().nullish(),
  title: z.string(),
  description: z.string().nullish(),
  fromDate: z.string().nullish(),
  toDate: z.string().nullish(),
});

export const UpdateEventAction = z.object({
  type: z.literal('UPDATE_EVENT'),
  title: z.string(),
  update: z.object({
    title: z.string().nullish(),
    description: z.string().nullish(),
    fromDate: z.string().nullish(),
    toDate: z.string().nullish(),
  }),
});

export const RemoveEventAction = z.object({
  type: z.literal('REMOVE_EVENT'),
  eventTitle: z.string(),
});

export const SendStatusAction = z.object({
  type: z.literal('SEND_STATUS'),
});

export const ResetAction = z.object({
  type: z.literal('RESET_TO_FACTORY'),
});

export const Actions = z.union([
  AddCompanyAction,
  UpdateCompanyAction,
  DeleteCompanyAction,
  MoveCompanyAction,
  AddEventAction,
  RemoveEventAction,
  UpdateEventAction,
  SendStatusAction,
  ResetAction,
]);

export const ActionSequence = z.object({
  actions: z.array(Actions),
});
