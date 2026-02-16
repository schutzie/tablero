// src/models/schemas.ts
import { z } from 'zod';
import { UserSchema, userSettingsSchema } from './users';
import { PlayerSchema } from './players';
import { TeamSchema } from './teams';
import { GameSchema } from './games';
import { GameEventSchema } from './gameEvents';
import { PlayerStatsSchema } from './playerStats';
import { LeagueSchema } from './leagues';
import { NotificationSchema } from './notifications';

// ============================================
// TYPE EXPORTS - TypeScript types inferred from Zod schemas
// ============================================

export type User = z.infer<typeof UserSchema>;
export type userSettings = z.infer<typeof userSettingsSchema>;
export type Player = z.infer<typeof PlayerSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type Game = z.infer<typeof GameSchema>;
export type GameEvent = z.infer<typeof GameEventSchema>;
export type PlayerStats = z.infer<typeof PlayerStatsSchema>;
export type League = z.infer<typeof LeagueSchema>;
export type Notification = z.infer<typeof NotificationSchema>;

// Helper types for partial updates
export type PartialUser = Partial<User>;
export type PartialPlayer = Partial<Player>;
export type PartialTeam = Partial<Team>;
export type PartialGame = Partial<Game>;

// Collection names as constants
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