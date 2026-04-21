import { z } from 'zod';

export const AddCompanyAction = z.object({
  type: z.literal('ADD_COMPANY'),
  floor: z.number(),
  name: z.string(),
  image: z.boolean(),
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
});

export const ChangeCompanyImage = z.object({
  type: z.literal('CHANGE_IMAGE'),
  companyName: z.string(),
  shouldBeChanged: z.boolean(),
});

export const Actions = z.union([
  AddCompanyAction,
  UpdateCompanyAction,
  DeleteCompanyAction,
  ChangeCompanyImage,
]);

export const ActionSequence = z.object({
  actions: z.array(Actions),
});
