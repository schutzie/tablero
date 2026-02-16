import { RuleSet } from "./dataModel";

export const RuleSets: RuleSet[] = [
  {
    id: "HS",
    default: true,
    name: "High School",
    description: "",
    courtLayout: "1",

    periods: 4,
    periodLength: 8,
    
    teamTimeoutsShort: 1,
    teamTimeoutsFull: 2,
    teamTimeoutPeriod: 4,
    
    otLimit: -1,
    otLength: 5,
    otTimeoutsShort: 1,
    otTimeoutsFull: 1,

    timeLineLimit: 10,
    personalFoulLimit: 5
  },
];
