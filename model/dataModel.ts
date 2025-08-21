import { PlayType } from "./enums";

export interface Game {
  id: string;
  teamHome: string;
  teamAway: string;
  location: string;
  tipoffTime: Date;
  ruleSet: RuleSet;
  ref1: string;
  ref2: string;
  ref3: string;
  ref4: string;
  scorer1: string;
  scorer2: string;
}

export interface Team {
  teamId: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

export interface Player {
  playerId: string;
  name: string;
}

export interface PlayEvent {
  id: string;
  gameId: string;
  playType: PlayType;
  p1id: string;
  p2id?: string;
  locationX: number;
  locationY: number;
  modifier?: string;
  size: number;
  qty?: number;
  clock: number;
  ts: Date;
}

export interface RuleSet {
  id: string;
  default: boolean;
  name: string;
  courtId: string;
  description: string;
  periods: number;
  periodLength: number;
  otLimit: number;
  otLength: number;

  teamTimeoutsShort: number;
  teamTimeoutsFull: number;
  teamTimeoutPeriod: number;
  otTimeoutsShort: number;
  otTimeoutsFull: number;

  timeLineLimit: number;
  personalFoulLimit: number;
}
