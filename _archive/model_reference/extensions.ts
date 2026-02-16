// ============================================
// ENUMS - Core constants used throughout the app
// ============================================

export enum AccountType {
  FREE = 'free',
  PREMIUM = 'premium',
  COACH = 'coach',
  ADMIN = 'admin'
}

export enum UserRole {
  PLAYER = 'player',
  COACH = 'coach',
  ADMIN = 'admin',
  FAN = 'fan',
  VIEWER = 'viewer',
  PARENT = 'parent'
}

export enum ProfileVisibility {
  PRIVATE = 'private',
  PARENT = 'parent',
  TEAM = 'team',
  PUBLIC = 'public'
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
  EXHIBITION = 'exhibition',
  SCRIMMAGE = 'scrimmage',
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
  // scoring
  FG2_ATTEMPT = 'FG2A', // 2 pt attempt
  FG2_MADE = 'FG2M', // 2 pt made
  FG3_ATTEMPT = 'FG3A', // 3 pt attempt
  FG3_MADE = 'FG3M', // 3 pt made
  FT_ATTEMPT = 'FTA', // free throw attempt
  FT_MADE = 'FTM', // free throw made

  // game action
  REBOUND_OFF = 'ro', // rebound offensive
  REBOUND_DEF = 'rd', // rebound defensive
  ASSIST = 'a', // assist
  STEAL = 's', // steal
  BLOCK = 'b', // block
  TURNOVER = 't', // turnover
  
  // fouls
  FOUL_DEFENSE = 'f_d',
  FOUL_OFFENSE = 'f_o',
  FOUL_TECHNICAL = 'f_te',
  FOUL_FLAGRANT = 'f_fl',
  EJECTION = 'ej', 
  
  // timing
  PERIOD_END = 'pe',
  PERIOD_START = 'ps',

  POSSESSION_ARROW = 'pa', // possession arrow
 
  // stoppage
  SUBSTITUTION = 'sub', // 
  TIMEOUT_FULL = 'tof', // timeout full
  TIMEOUT_SHORT = 'tos', // timeout short
  TIMEOUT_OFFICIAL = 'too', // officials timeout

  // other
  TIP_OFF = 'tipoff',
  JUMP_BALL_TIEUP = 'jbt', // jump ball from possession tie-up
  JUMP_BALL_OTHER = 'jbo', // jump ball other reason
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
