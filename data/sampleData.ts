import { PlayEvent, Team } from "../model/dataModel";
import { PlayType } from "../model/enums";

export const teams: Team[] = [
  {teamId: "1",
  name: "Schmeredith",
  primaryColor: "#ff0000",
  secondaryColor: "#000000",
  tertiaryColor: "#c0c0c0"},
  {teamId: "2",
  name: "Griffin",
  primaryColor: "#ffff00",
  secondaryColor: "#0000ff",
  tertiaryColor: "#888888"},
]

export const playEvents: PlayEvent[] = [
  { id: "1", gameId: "1", playType: PlayType.TwoPointMade, locationX: 100, locationY: 100, p1id: "1"},
  { id: "2", gameId: "1",playType: PlayType.ThreePointMissed, locationX: 150, locationY: 225, p1id: "1" },
  { id: "3", gameId: "1",playType: PlayType.ThreePointMade, locationX: 225, locationY: 150, p1id: "2" },
  { id: "4", gameId: "1",playType: PlayType.Assist, locationX: 200, locationY: 200, p1id: "1" },
];

