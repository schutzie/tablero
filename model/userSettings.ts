import * as z from "zod"; 
import { TimestampSchema } from '../_archive/model_old/helpers';
import { AccountType, ProfileVisibility, UserRole } from "./enums";

// ============================================
// USER & PREFERENCES SCHEMAS
// ============================================
// User preferences embedded within user document
export const UserSettingsSchema = z.object({
  notifications: z.object({
    gameReminders: z.boolean().default(false),
    teamUpdates: z.boolean().default(false),
    statsAlerts: z.boolean().default(false),
    pushEnabled: z.boolean().default(false),
  }),
  ui: z.object({
    theme: z.enum(['Light', 'Dark', 'Auto']).default('Auto'),
    language: z.string().default('English'),
    hapticFeedback: z.enum(['Low', 'High', 'Off']),
    animation: z.enum(['On', 'Off']),
    soundEffects: z.enum(['On', 'Off']),
    textSize: z.enum(['Smaller', 'Larger', 'Default']).default('Default'),

  }),
general: z.object({
  timezone: z.enum(['Device default', 
      'US Eastern Time	(UTC -5:00 / -4:00)',
      'US Central Time	(UTC -6:00 / -5:00)',
      'US Mountain Time	(UTC -7:00 / -6:00)',
      'US Pacific Time	(UTC -8:00 / -7:00)']).default('Device default'),
    measurementUnit: z.enum(['Imperial', 'Metric']).default('Imperial'),
    networkUsage: z.enum(['Any', 'Wifi only']),
    
})

  // privacy: z.object({
  //   profileVisibility: z.nativeEnum(ProfileVisibility).default(ProfileVisibility.TEAM),
  //   showStats: z.boolean().default(true),
  //   allowTeamInvites: z.boolean().default(true)
  // })
});
// Main user schema

export const UserSchema = z.object({
  // Authentication & Profile
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().url().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),

  // User Metadata
  createdAt: TimestampSchema,
  lastLoginAt: TimestampSchema,
  isActive: z.boolean().default(true),
  accountType: z.nativeEnum(AccountType).default(AccountType.FREE),

  // Player Association
  linkedPlayerId: z.string().optional().nullable(),

  // Preferences
  userSettings: UserSettingsSchema,

  // Following/Favorites
  followingPlayers: z.array(z.string()).default([]),
  followingTeams: z.array(z.string()).default([]),
  favoriteGames: z.array(z.string()).default([]),

  // Roles & Permissions
  roles: z.array(z.nativeEnum(UserRole)).default([UserRole.FAN]),
  teamRoles: z.record(z.string(), z.string()).default({})
});

export type User = z.infer<typeof UserSchema>;
export type PartialUser = Partial<User>;
export type userSettings = z.infer<typeof UserSettingsSchema>;
