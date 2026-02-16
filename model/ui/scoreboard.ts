import * as z from "zod";
import { MetadataSchema } from "../helpers/metadata";

const ScoreboardSchema = MetadataSchema.extend({
  id: z.string(),
  scoreHome: z.number().default(0),
  scoreVisitor: z.number().default(0),
  currentClockTime: z.number().default(0),
  currentPeriod: z.number().optional(),
  foulsHome: z.number().default(0),
  foulsVisitor: z.number().default(0)
});

export type Scoreboard = z.infer<typeof ScoreboardSchema>;
export type ScoreboardPartial = Partial<Scoreboard>;
