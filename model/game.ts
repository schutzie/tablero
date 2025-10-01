import * as z from "zod"; 
import { TimestampSchema, OptionalTimestampSchema } from './helpers';
import { GameStatus, GameType } from "./enums";

// ============================================
// GAME SCHEMA
// ============================================
const TeamInGameSchema = z.object({
  teamId: z.string(),
  name: z.string(),
  logoURL: z.url().optional().nullable(),
  score: z.number().min(0).default(0),
  timeouts: z.number().min(0).max(7).default(7),
  fouls: z.number().min(0).default(0)
});
const OfficialSchema = z.object({
  name: z.string(),
  role: z.enum(['crew_chief', 'referee', 'umpire'])
});
const GamePlayerSchema = z.object({
  playerId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  jerseyNumber: z.number(),
  starter: z.boolean().default(false),
  active: z.boolean().default(true)
});
const TeamStatsSchema = z.object({
  fieldGoalsMade: z.number().default(0),
  fieldGoalsAttempted: z.number().default(0),
  threePointersMade: z.number().default(0),
  threePointersAttempted: z.number().default(0),
  freeThrowsMade: z.number().default(0),
  freeThrowsAttempted: z.number().default(0),
  rebounds: z.number().default(0),
  assists: z.number().default(0),
  steals: z.number().default(0),
  blocks: z.number().default(0),
  turnovers: z.number().default(0)
});

export const GameSchema = z.object({
  // Game Identity
  gameId: z.string(),
  gameType: z.nativeEnum(GameType).default(GameType.REGULAR),

  // Teams
  homeTeam: TeamInGameSchema,
  awayTeam: TeamInGameSchema,

  // Schedule & Venue
  scheduledAt: TimestampSchema,
  venue: z.string(),
  venueAddress: z.string().optional(),

  // Game Status
  status: z.nativeEnum(GameStatus).default(GameStatus.SCHEDULED),
  currentPeriod: z.number().min(1).default(1),
  currentTime: z.string().default('12:00'),
  isHalftime: z.boolean().default(false),
  isOvertime: z.boolean().default(false),

  // Officials
  officials: z.array(OfficialSchema).default([]),

  // Live Score
  score: z.object({
    home: z.number().default(0),
    away: z.number().default(0),
    quarterScores: z.object({
      home: z.array(z.number()).default([]),
      away: z.array(z.number()).default([])
    })
  }),

  // Participating Players
  homePlayers: z.array(GamePlayerSchema).default([]),
  awayPlayers: z.array(GamePlayerSchema).default([]),

  // Game Stats Summary
  teamStats: z.object({
    home: TeamStatsSchema,
    away: TeamStatsSchema
  }).optional(),

  // Metadata
  seasonId: z.string().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  completedAt: OptionalTimestampSchema,
  attendance: z.number().optional(),
  broadcastInfo: z.object({
    tv: z.array(z.string()).default([]),
    radio: z.array(z.string()).default([]),
    streaming: z.array(z.string()).default([])
  }).optional()
});

export type Game = z.infer<typeof GameSchema>;
export type PartialGame = Partial<Game>;