import * as z from "zod";

export const TimestampsSchema = z.object({
  created: z.iso.datetime().default(() => new Date().toISOString()),
  modified: z.iso.datetime().default(() => new Date().toISOString()),
});

export const MetadataSchema = z.object({
  timestamps: TimestampsSchema,
});

export type Metadata = z.infer<typeof MetadataSchema>;
export type MetadataPartial = Partial<Metadata>;