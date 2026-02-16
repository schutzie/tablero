import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Scoreboard } from '../model/ui/scoreboard';

const initialState: Scoreboard = {
  id: '',
  scoreHome: 0,
  scoreVisitor: 0,
  currentClockTime: 0,
  currentPeriod: undefined,
  foulsHome: 0,
  foulsVisitor: 0,
  timestamps: {
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
};

const scoreboardSlice = createSlice({
  name: 'scoreboard',
  initialState,
  reducers: {
    addScore(state, action: PayloadAction<{ team: 'home' | 'visitor'; points: number }>) {
      const { team, points } = action.payload;
      if (team === 'home') {
        state.scoreHome += points;
      } else {
        state.scoreVisitor += points;
      }
      state.timestamps.modified = new Date().toISOString();
    },
    addFoul(state, action: PayloadAction<{ team: 'home' | 'visitor' }>) {
      if (action.payload.team === 'home') {
        state.foulsHome += 1;
      } else {
        state.foulsVisitor += 1;
      }
      state.timestamps.modified = new Date().toISOString();
    },
    updateClock(state, action: PayloadAction<number>) {
      state.currentClockTime = action.payload;
      state.timestamps.modified = new Date().toISOString();
    },
    setPeriod(state, action: PayloadAction<number>) {
      state.currentPeriod = action.payload;
      state.timestamps.modified = new Date().toISOString();
    },
    resetScoreboard() {
      return {
        ...initialState,
        timestamps: {
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
        },
      };
    },
  },
});

export const { addScore, addFoul, updateClock, setPeriod, resetScoreboard } = scoreboardSlice.actions;
export default scoreboardSlice.reducer;
