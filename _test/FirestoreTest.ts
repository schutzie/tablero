import * as z from "zod";
import { MetadataSchema } from "../model/helpers/metadata";

const FirestoreTestSchema = MetadataSchema.extend({
  id: z.string(),
  stringField: z.string(),
  stringFieldWithDefault: z.string().default("test default value");
  dateField: z.iso.datetime(),
  dateFieldWithDefault: z.iso.datetime().default("2026-01-31T15:05.000000Z"),
  dateFieldWithDefaultNow: z.iso.datetime().default(() => new Date().toISOString()),
  arrayOfStrings: z.array
});

export type FirestoreTest = z.infer<typeof FirestoreTestSchema>;
export type FirestoreTestPartial = Partial<FirestoreTest>;
