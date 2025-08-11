export enum PlayType {
  // Scoring Plays
  ThreePointMade = "3PM",
  ThreePointMissed = "3PA",
  TwoPointMade = "2PM",
  TwoPointMissed = "2PA",
  FreeThrowMade = "1PM",
  FreeThrowMissed = "1PA",

  // Ball Possession
  ReboundOff = "RO",
  ReboundDef = "RD",
  Steal = "S",
  Block = "B",
  Assist = "A",
  OutOfBounds = "OB",

  // time related
  ShotClockViolation = "SC",
  BackCourtViolation = "BC",
  InboundTimerViolation = "IT", // dead ball
  FreeThrowLaneViolationOff = "LVO", // dead ball
  FreeThrowLaneViolationDef = "LVD", // dead ball
  Timeout = "TO",
  StartOfPeriod = "SOP",
  EndOfPeriod = "EOP",
  StartOfGame = "SOG",
  EndOfGame = "EOG",

  // Stoppages and Game Flow
  FoulFlagrantOne = "FF1",
  FoulFlagrantTwo = "FF2",
  FoulPersonalDef = "FPD",
  FoulPersonalOff = "FPO",

  Substitution = "SUB",
  JumpBall = "JB",

  // Violations (more specific turnovers)

  Traveling = "TR",
  DoubleDribble = "DD",
  DelayOfGame = "DOG",
}
