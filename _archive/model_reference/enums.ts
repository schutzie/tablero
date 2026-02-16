// Common Enums
const AccountTypeSchema = z.enum(["free", "premium", "coach", "admin"]);
const ThemeSchema = z.enum(["light", "dark"]);
const MeasurementUnitSchema = z.enum(["imperial", "metric"]);
const VisibilitySchema = z.enum(["private", "team", "public"]);
const PositionSchema = z.enum(["PG", "SG", "SF", "PF", "C"]);
const SkillLevelSchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "professional",
]);
const GameTypeSchema = z.enum([
  "regular",
  "playoff",
  "exhibition",
  "tournament",
]);
const GameStatusSchema = z.enum([
  "scheduled",
  "live",
  "final",
  "postponed",
  "cancelled",
]);
const RoleSchema = z.enum(["admin", "coach", "player", "fan"]);
const PlayerRoleSchema = z.enum(["starter", "bench", "reserve"]);
const EventTypeSchema = z.enum([
  "field_goal",
  "three_pointer",
  "free_throw",
  "rebound",
  "assist",
  "steal",
  "block",
  "turnover",
  "foul",
  "timeout",
  "substitution",
  "period_start",
  "period_end",
  "jump_ball",
  "violation",
]);
const ShotTypeSchema = z.enum([
  "layup",
  "dunk",
  "jump_shot",
  "three_pointer",
  "hook_shot",
  "fadeaway",
  "bank_shot",
  "tip_in",
  "alley_oop",
]);

// export enum PlayType {
//   // Scoring Plays
//   ThreePointMade = "3PM",
//   ThreePointMissed = "3PA",
//   TwoPointMade = "2PM",
//   TwoPointMissed = "2PA",
//   FreeThrowMade = "1PM",
//   FreeThrowMissed = "1PA",

//   // Ball Possession
//   ReboundOff = "RO",
//   ReboundDef = "RD",
//   Steal = "S",
//   Block = "B",
//   Assist = "A",
//   OutOfBounds = "OB",

//   // time related
//   ShotClockViolation = "SC",
//   BackCourtViolation = "BC",
//   InboundTimerViolation = "IT", // dead ball
//   FreeThrowLaneViolationOff = "LVO", // dead ball
//   FreeThrowLaneViolationDef = "LVD", // dead ball
//   Timeout = "TO",
//   StartOfPeriod = "SOP",
//   EndOfPeriod = "EOP",
//   StartOfGame = "SOG",
//   EndOfGame = "EOG",

//   // Stoppages and Game Flow
//   FoulFlagrantOne = "FF1",
//   FoulFlagrantTwo = "FF2",
//   FoulPersonalDef = "FPD",
//   FoulPersonalOff = "FPO",

//   Substitution = "SUB",
//   JumpBall = "JB",

//   // Violations (more specific turnovers)

//   Traveling = "TR",
//   DoubleDribble = "DD",
//   DelayOfGame = "DOG",
// }
