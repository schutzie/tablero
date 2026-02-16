import * as z from "zod"; 
import { ShotType } from "./enums";

// ============================================
// PLAYER STATS SCHEMA (Per Game)
// ============================================
const ShotChartDataSchema = z.object({
  x: z.number(),
  y: z.number(),
  made: z.boolean(),
  shotType: z.nativeEnum(ShotType),
  period: z.number(),
  timeRemaining: z.string()
});

export const PlayerStatsSchema = z.object({
  // Identity
  playerId: z.string(),
  playerName: z.string(),
  teamId: z.string(),
  jerseyNumber: z.number(),

  // Playing Time
  starter: z.boolean(),
  minutesPlayed: z.string(), // "MM:SS" format


  // Scoring
  points: z.number().default(0),
  fieldGoalsMade: z.number().default(0),
  fieldGoalsAttempted: z.number().default(0),
  fieldGoalPercentage: z.number().min(0).max(1).default(0),
  threePointersMade: z.number().default(0),
  threePointersAttempted: z.number().default(0),
  threePointPercentage: z.number().min(0).max(1).default(0),
  freeThrowsMade: z.number().default(0),
  freeThrowsAttempted: z.number().default(0),
  freeThrowPercentage: z.number().min(0).max(1).default(0),

  // Rebounds
  reboundsTotal: z.number().default(0),
  reboundsOffensive: z.number().default(0),
  reboundsDefensive: z.number().default(0),

  // Playmaking & Defense
  assists: z.number().default(0),
  steals: z.number().default(0),
  blocks: z.number().default(0),
  turnovers: z.number().default(0),

  // Fouls
  personalFouls: z.number().default(0),
  technicalFouls: z.number().default(0),
  flagrantFouls: z.number().default(0),
  fouledOut: z.boolean().default(false),

  // Advanced Stats
  plusMinus: z.number().default(0),
  offensiveRating: z.number().optional(),
  defensiveRating: z.number().optional(),
  effectiveFieldGoalPercentage: z.number().min(0).max(1).optional(),
  trueShootingPercentage: z.number().min(0).max(1).optional(),
  usageRate: z.number().min(0).max(1).optional(),

  // Shot Chart Data
  shotChartData: z.array(ShotChartDataSchema).default([])
});

export type PlayerStats = z.infer<typeof PlayerStatsSchema>;
