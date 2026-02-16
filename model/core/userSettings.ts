import * as z from "zod";
import { MetadataSchema } from "../helpers/metadata";

const SettingSchema = z.object({
  settingKey: z.string(),
  settingValue: z.string().optional(),
  // startDate: z.date().default(new Date("1900-01-01")),
  // endDate: z.date().default(new Date("9999-12-31"))
});

const UserSettingsSchema = MetadataSchema.extend({
  id: z.string(),
  user: z.string(),
  settings: z.array(SettingSchema),
  scope: z.string()
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type MetadataPartial = Partial<UserSettings>;
