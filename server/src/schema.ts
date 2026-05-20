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

export const Actions = z.union([
  AddCompanyAction,
  UpdateCompanyAction,
  DeleteCompanyAction,
  MoveCompanyAction,
]);

export const ActionSequence = z.object({
  actions: z.array(Actions),
});
