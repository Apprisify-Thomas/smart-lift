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

export const UpdateCompanyAction = z.object({
  type: z.literal('UPDATE_COMPANY'),
  findName: z.string(),
  replaceWith: z.string()
})

export const ActionSequence = z.array(InterpretedAction);