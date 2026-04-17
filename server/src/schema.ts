import { z } from "zod";

export const ActionType = z.union([
  z.literal('UPDATE'),
  z.literal('DELETE'),
  z.literal('ADD'),
]);

export const InterpretedAction = z.object({
  actionType: ActionType,
  floor: z.number(),
  companyName: z.string(),
  replacedByName: z.string(),
  image: z.boolean()
});

export const AddCompanyAction = z.object({
  type: z.literal('ADD'),
  floor: z.number(),
  companyName: z.string(),
  image: z.boolean()
});

export const DeleteCompanyAction = z.object({
  type: z.literal('DELETE'),
  name: z.string(),
});

export const UpdateCompanyAction = z.object({
  type: z.literal('UPDATE'),
  findName: z.string(),
  replaceWith: z.string(),
  image: z.boolean().nullable()
});

export const MoveCompanyAction = z.object({
  type: z.literal('MOVE'),
  name: z.string(),
  fromFloor: z.number(),
  toFloor: z.number()
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
  MoveCompanyAction,
  ChangeCompanyImage
]);

export const ActionSequence = z.object({
  actions: z.array(Actions)
});