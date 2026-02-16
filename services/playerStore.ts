import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';

export const playerStore = configureStore({
  reducer: {
    players: playerReducer,
  },
});

export type PlayerRootState = ReturnType<typeof playerStore.getState>;
export type PlayerAppDispatch = typeof playerStore.dispatch;
