import * as z from "zod";
import { TimestampSchema } from "./helpers";
import { Position, SkillLevel, TeamRole } from "./enums";

// ============================================
// PLAYER SCHEMA
// ============================================
const CareerStatsSchema = z.object({
  gamesPlayed: z.number().default(0),
  totalPoints: z.number().default(0),
  totalRebounds: z.number().default(0),
  totalAssists: z.number().default(0),
  avgPointsPerGame: z.number().default(0),
  avgReboundsPerGame: z.number().default(0),
  avgAssistsPerGame: z.number().default(0),
  fieldGoalPercentage: z.number().min(0).max(1).default(0),
  threePointPercentage: z.number().min(0).max(1).default(0),
  freeThrowPercentage: z.number().min(0).max(1).default(0),
});
const CurrentTeamSchema = z.object({
  teamId: z.string(),
  role: z.nativeEnum(TeamRole),
  joinedAt: TimestampSchema,
});

export const PlayerSchema = z.object({
  // Basic Info
  playerId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string().optional(),
  jerseyNumber: z.string(),
  position: z.array(z.nativeEnum(Position)),
  height: z.number().positive(), // in cm
  weight: z.number().positive(), // in kg
  dateOfBirth: TimestampSchema.optional(),
  photoURL: z.string().url().optional().nullable(),

  // Contact & Location
  email: z.email().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("USA"),

  // Career Info
  yearsOfExperience: z.number().min(0).default(0),
  skillLevel: z.nativeEnum(SkillLevel).default(SkillLevel.INTERMEDIATE),
  dominantHand: z.enum(["left", "right", "ambidextrous"]).default("right"),

  // Current Team Associations
  currentTeams: z.array(CurrentTeamSchema).default([]),

  // Aggregated Stats
  careerStats: CareerStatsSchema.default({}),
  currentSeasonStats: z
    .object({
      seasonId: z.string(),
      gamesPlayed: z.number(),
      points: z.number(),
      rebounds: z.number(),
      assists: z.number(),
      fieldGoalPercentage: z.number().min(0).max(1),
      threePointPercentage: z.number().min(0).max(1),
      freeThrowPercentage: z.number().min(0).max(1),
    })
    .optional(),

  // Metadata
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  isActive: z.boolean().default(true),
  linkedUserId: z.string().optional().nullable(),
});

export type Player = z.infer<typeof PlayerSchema>;
export type PartialPlayer = Partial<Player>;
