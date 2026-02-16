import { configureStore } from '@reduxjs/toolkit';
import firestoreTestingReducer from './firestoreTestingSlice';

export const testStore = configureStore({
  reducer: {
    firestoreTesting: firestoreTestingReducer,
  },
});

export type TestRootState = ReturnType<typeof testStore.getState>;
export type TestAppDispatch = typeof testStore.dispatch;
