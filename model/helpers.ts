import { Timestamp } from 'firebase/firestore';
import * as z from "zod"; 

// ============================================
// HELPER SCHEMAS - Reusable schema components
// ============================================

// Custom Timestamp schema that handles Firebase Timestamps
export const TimestampSchema = z.custom<Timestamp>((val) => val instanceof Timestamp);
// Schema for optional timestamps with null handling
export const OptionalTimestampSchema = z.union([TimestampSchema, z.null()]).optional();
// Base metadata that most documents will have
const BaseMetadataSchema = z.object({
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  isActive: z.boolean().default(true)
});

export const COLLECTIONS = {
  USERS: 'users',
  PLAYERS: 'players',
  TEAMS: 'teams',
  GAMES: 'games',
  GAME_EVENTS: 'gameEvents',
  PLAYER_STATS: 'playerStats',
  LEAGUES: 'leagues',
  NOTIFICATIONS: 'notifications',
  VENUES: 'venues',
  MEDIA: 'media',
  PRACTICES: 'practices',
  INJURIES: 'injuries'
} as const;