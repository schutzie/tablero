import * as z from "zod"; 
import { TimestampSchema } from '../_archive/model_old/helpers';
import { LeagueType } from "./enums";

// ============================================
// LEAGUE SCHEMA
// ============================================
const GameSettingsSchema = z.object({
  quarterLength: z.number().default(12), // minutes
  shotClock: z.number().default(24), // seconds
  overtimeLength: z.number().default(5), // minutes
  timeoutsPerHalf: z.number().default(3),
  foulsToBonus: z.number().default(5),
  foulsToDisqualify: z.number().default(6)
});
const StandingsEntrySchema = z.object({
  teamId: z.string(),
  teamName: z.string(),
  wins: z.number(),
  losses: z.number(),
  winPercentage: z.number().min(0).max(1),
  gamesBack: z.number(),
  streakType: z.enum(['W', 'L', 'N']),
  streakCount: z.number()
});

export const LeagueSchema = z.object({
  leagueId: z.string(),
  name: z.string(),
  abbreviation: z.string().max(10),
  logoURL: z.string().url().optional().nullable(),

  // League Info
  type: z.nativeEnum(LeagueType).default(LeagueType.RECREATIONAL),
  sport: z.literal('basketball'),
  level: z.enum(['youth', 'high_school', 'college', 'adult', 'professional']),

  // Season Info
  currentSeasonId: z.string().optional(),
  seasonStartDate: TimestampSchema.optional(),
  seasonEndDate: TimestampSchema.optional(),
  registrationDeadline: TimestampSchema.optional(),

  // Structure
  numberOfTeams: z.number(),
  numberOfDivisions: z.number().optional(),
  playoffFormat: z.string().optional(),
  gamesPerTeam: z.number(),

  // Rules & Settings
  gameSettings: GameSettingsSchema,

  // Standings
  standings: z.array(StandingsEntrySchema).default([]),

  // Contact
  commissioner: z.string().optional(),
  commissionerEmail: z.string().email().optional(),
  website: z.string().url().optional(),

  // Metadata
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  isActive: z.boolean().default(true)
});

export type League = z.infer<typeof LeagueSchema>;