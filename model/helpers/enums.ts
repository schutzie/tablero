// ============================================
// ENUMS - Core constants used throughout the app
// ============================================

export enum AccountType {
  Free = 'free',
  Premium = 'premium',
  Coach = 'coach',
  Admin = 'admin'
}

export enum UserRole {
  Player = 'player',
  Coach = 'coach',
  Admin = 'admin',
  Fan = 'fan',
  Viewer = 'viewer',
  Parent = 'parent'
}

export enum ProfileVisibility {
  Private = 'private',
  Parent = 'parent',
  Team = 'team',
  Public = 'public'
}

export enum Position {
  PG = '1 / PG', // Point Guard
  SG = '2 / SG', // Shooting Guard
  SF = '3 / SF', // Small Forward
  PF = '4 / PF', // Power Forward
  C = '5 / C',    // Center
  O = 'Other',    // Other
}

export enum SkillLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Professional = 'professional'
}

export enum TeamRole {
  Starter = 'starter',
  Bench = 'bench',
  Reserve = 'reserve'
}

export enum NotificationType {
  GameReminder = 'gameReminder',
  StatsUpdate = 'statsUpdate',
  TeamInvite = 'teamInvite',
  Achievement = 'achievement',
  News = 'news',
  FinalScore = 'finalScore'
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
