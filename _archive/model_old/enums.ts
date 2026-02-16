// ============================================
// ENUMS - Core constants used throughout the app
// ============================================

// export enum AccountType {
//   FREE = 'free',
//   PREMIUM = 'premium',
//   COACH = 'coach',
//   ADMIN = 'admin'
// }

// account
export enum UserRole {
  PLAYER = 'player',
  COACH = 'coach',
  ADMIN = 'admin',
  FAN = 'fan'
}

export enum ProfileVisibility {
  PRIVATE = 'private',
  TEAM = 'team',
  PUBLIC = 'public'
}

export enum Position {
  PG = 'PG', // Point Guard
  SG = 'SG', // Shooting Guard
  SF = 'SF', // Small Forward
  PF = 'PF', // Power Forward
  C = 'C'    // Center
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional'
}

export enum TeamRole {
  STARTER = 'starter',
  BENCH = 'bench',
  RESERVE = 'reserve'
}

export enum GameType {
  REGULAR = 'regular',
  PLAYOFF = 'playoff',
  EXHIBITION = 'exhibition',
  TOURNAMENT = 'tournament'
}

export enum GameStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINAL = 'final',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled'
}

export enum EventType {
  FIELD_GOAL = 'field_goal',
  THREE_POINTER = 'three_pointer',
  FREE_THROW = 'free_throw',
  REBOUND_OFFENSIVE = 'rebound_offensive',
  REBOUND_DEFENSIVE = 'rebound_defensive',
  ASSIST = 'assist',
  STEAL = 'steal',
  BLOCK = 'block',
  TURNOVER = 'turnover',
  FOUL_PERSONAL = 'foul_personal',
  FOUL_TECHNICAL = 'foul_technical',
  FOUL_FLAGRANT = 'foul_flagrant',
  TIMEOUT = 'timeout',
  SUBSTITUTION = 'substitution',
  PERIOD_START = 'period_start',
  PERIOD_END = 'period_end',
  JUMP_BALL = 'jump_ball',
  VIOLATION = 'violation'
}

export enum ShotType {
  LAYUP = 'layup',
  DUNK = 'dunk',
  JUMP_SHOT = 'jump_shot',
  HOOK_SHOT = 'hook_shot',
  FADEAWAY = 'fadeaway',
  FLOATER = 'floater',
  TIP_IN = 'tip_in',
  PUTBACK = 'putback'
}

export enum LeagueType {
  PROFESSIONAL = 'professional',
  SEMI_PRO = 'semi_pro',
  RECREATIONAL = 'recreational',
  YOUTH = 'youth'
}

export enum NotificationType {
  GAME_REMINDER = 'game_reminder',
  STATS_UPDATE = 'stats_update',
  TEAM_INVITE = 'team_invite',
  ACHIEVEMENT = 'achievement',
  NEWS = 'news'
}

