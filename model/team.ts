import * as z from "zod"; 
import { TimestampSchema } from '../_archive/model_old/helpers';
import { Position, TeamRole } from "./enums";

// ============================================
// TEAM SCHEMA
// ============================================
const RosterPlayerSchema = z.object({
  playerId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  jerseyNumber: z.string(),
  position: z.array(z.nativeEnum(Position)),
  role: z.nativeEnum(TeamRole),
  joinedAt: TimestampSchema
});
const CoachSchema = z.object({
  userId: z.string(),
  name: z.string(),
  role: z.enum(['head_coach', 'assistant_coach', 'trainer']),
  email: z.string().email()
});

export const TeamSchema = z.object({
  // Basic Info
  teamId: z.string(),
  name: z.string(),
  abbreviation: z.string().max(5),
  logoURL: z.string().url().optional().nullable(),
  colorPrimary: z.string(),
  colorSecondary: z.string(),

  // Organization
  league: z.string().optional(),
  division: z.string().optional(),
  conference: z.string().optional(),
  foundedYear: z.number().optional(),

  // Location
  city: z.string(),
  state: z.string(),
  country: z.string().default('USA'),
  homeVenue: z.string().optional(),
  venueCapacity: z.number().optional(),

  // Contact
  managerName: z.string().optional(),
  managerEmail: z.string().email().optional(),
  managerPhone: z.string().optional(),

  // Roster
  roster: z.array(RosterPlayerSchema).default([]),

  // Coaching Staff
  coaches: z.array(CoachSchema).default([]),

  // Season Record
  currentSeason: z.object({
    seasonId: z.string(),
    wins: z.number().default(0),
    losses: z.number().default(0),
    winPercentage: z.number().min(0).max(1).default(0),
    homeRecord: z.string().default('0-0'),
    awayRecord: z.string().default('0-0'),
    streakType: z.enum(['W', 'L', 'N']).default('N'),
    streakCount: z.number().default(0)
  }).optional(),

  // Metadata
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  isActive: z.boolean().default(true),
  visibility: z.enum(['private', 'public']).default('public')
});

export type Team = z.infer<typeof TeamSchema>;
export type PartialTeam = Partial<Team>;