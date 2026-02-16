import * as z from "zod"; 
import { TimestampSchema } from './helpers';
import { EventType, ShotType } from "./enums";

// ============================================
// GAME EVENT SCHEMA
// ============================================
export const GameEventSchema = z.object({
  eventId: z.string(),
  eventType: z.nativeEnum(EventType),
  timestamp: TimestampSchema,

  // Game time
  period: z.number(),
  gameMinutes: z.number().min(0).max(12),
  gameSeconds: z.number().min(0).max(59),

  // Core event data
  playerId: z.string().optional(),
  playerName: z.string().optional(),
  teamId: z.string(),
  description: z.string(),

  // Location (optional)
  locationX: z.number().optional(),
  locationY: z.number().optional(),

  // Shot-specific fields (only for shot events)
  shotType: z.nativeEnum(ShotType).optional(),
  shotDistance: z.number().optional(),
  shotMade: z.boolean().optional(),
  points: z.number().optional(),

  // Assist data (for made shots)
  assistPlayerId: z.string().optional(),
  assistPlayerName: z.string().optional(),

  // Rebound fields
  reboundType: z.enum(['offensive', 'defensive']).optional(),
  contested: z.boolean().optional(),

  // Foul fields
  foulType: z.enum(['personal', 'technical', 'flagrant1', 'flagrant2']).optional(),
  fouledPlayerId: z.string().optional(),
  fouledPlayerName: z.string().optional(),
  bonusStatus: z.enum(['none','single', 'double']).optional(),
  freeThrowsAwarded: z.number().optional(),

  // Substitution fields
  playerInId: z.string().optional(),
  playerInName: z.string().optional(),
  playerOutId: z.string().optional(),
  playerOutName: z.string().optional(),

  // Score
  homeScore: z.number(),
  awayScore: z.number(),

  // Media
  videoURL: z.url().optional(),
  isHighlight: z.boolean().default(false)
});

export type GameEvent = z.infer<typeof GameEventSchema>;