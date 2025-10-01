import * as z from "zod"; 
import { TimestampSchema } from './helpers';
import { AccountType, ProfileVisibility, UserRole } from "./enums";

// ============================================
// USER & PREFERENCES SCHEMAS
// ============================================
// User preferences embedded within user document
export const UserPreferencesSchema = z.object({
  notifications: z.object({
    gameReminders: z.boolean().default(true),
    teamUpdates: z.boolean().default(true),
    statsAlerts: z.boolean().default(true),
    pushEnabled: z.boolean().default(true),
    emailDigest: z.enum(['daily', 'weekly', 'monthly', 'never']).default('weekly')
  }),
  display: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    language: z.string().default('en'),
    timezone: z.string().default('America/New_York'),
    measurementUnit: z.enum(['imperial', 'metric']).default('imperial')
  }),
  privacy: z.object({
    profileVisibility: z.nativeEnum(ProfileVisibility).default(ProfileVisibility.TEAM),
    showStats: z.boolean().default(true),
    allowTeamInvites: z.boolean().default(true)
  })
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
  preferences: UserPreferencesSchema,

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
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;