import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import gameReducer from './slices/gameSlice';
import gameEventReducer from './slices/gameEventSlice';
import leagueReducer from './slices/leagueSlice';
import notificationReducer from './slices/notificationSlice';
import playerReducer from './slices/playerSlice';
import playerStatReducer from './slices/playerStatSlice';
import teamReducer from './slices/teamSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    games: gameReducer,
    gameEvents: gameEventReducer,
    leagues: leagueReducer,
    notifications: notificationReducer,
    players: playerReducer,
    playerStats: playerStatReducer,
    teams: teamReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['firebase/add', 'firebase/update'],
        ignoredPaths: ['firebase'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;