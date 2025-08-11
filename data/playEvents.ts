export interface PlayEvent {
  id: number;
  eventType: string;
  locationX: number;
  locationY: number;
  size: number;
}

export const playEvents: PlayEvent[] = [
  { id: 1, eventType: "FG2A", locationX: 100, locationY: 100, size: 30 },
  { id: 2, eventType: "FG2M", locationX: 150, locationY: 225, size: 50 },
  { id: 3, eventType: "FG3M", locationX: 225, locationY: 150, size: 50 },
  { id: 4, eventType: "FG3M", locationX: 200, locationY: 200, size: 50 },
];
