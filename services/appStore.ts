import { configureStore } from '@reduxjs/toolkit';
import scoreboardReducer from './scoreboardSlice';

export const appStore = configureStore({
  reducer: {
    scoreboard: scoreboardReducer,
  },
});

export type AppRootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
