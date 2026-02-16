import * as z from "zod"; 

export const PersonSchema = z.object({
  personId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

export type Person = z.infer<typeof PersonSchema>;
export type PartialPerson = Partial<Person>;