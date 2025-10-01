import { createCrudSlice } from './baseCrudSlice';
import { GameEvent } from '../../model/gameEvent';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  updateDoc,
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { EventType } from '../../model/enums';

const { slice: baseSlice, actions: baseActions } = createCrudSlice<GameEvent>('gameEvents', 'gameEvents', 'eventId');

// Custom async thunks for game-specific operations
export const fetchByGame = createAsyncThunk(
  'gameEvents/fetchByGame',
  async (gameId: string) => {
    const q = query(
      collection(db, 'gameEvents'),
      where('gameId', '==', gameId),
      orderBy('timestamp', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      eventId: doc.id,
      ...doc.data()
    })) as GameEvent[];
  }
);

export const fetchByPeriod = createAsyncThunk(
  'gameEvents/fetchByPeriod',
  async ({ gameId, period }: { gameId: string; period: number }) => {
    const q = query(
      collection(db, 'gameEvents'),
      where('gameId', '==', gameId),
      where('period', '==', period),
      orderBy('gameMinutes', 'desc'),
      orderBy('gameSeconds', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      eventId: doc.id,
      ...doc.data()
    })) as GameEvent[];
  }
);

export const fetchShotEvents = createAsyncThunk(
  'gameEvents/fetchShotEvents',
  async ({ gameId, playerId }: { gameId?: string; playerId?: string }) => {
    const constraints = [];
    if (gameId) constraints.push(where('gameId', '==', gameId));
    if (playerId) constraints.push(where('playerId', '==', playerId));
    
    // Fetch all shot-related events
    const shotTypes = [EventType.FG2_ATTEMPT, EventType.FG2_MADE, EventType.FG3_ATTEMPT, EventType.FG3_MADE];
    constraints.push(where('eventType', 'in', shotTypes));
    
    const q = query(collection(db, 'gameEvents'), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      eventId: doc.id,
      ...doc.data()
    })) as GameEvent[];
  }
);

export const markAsHighlight = createAsyncThunk(
  'gameEvents/markAsHighlight',
  async ({ eventId, isHighlight }: { eventId: string; isHighlight: boolean }) => {
    const docRef = doc(db, 'gameEvents', eventId);
    await updateDoc(docRef, { 
      isHighlight,
      updatedAt: Timestamp.now() 
    });
    return { eventId, isHighlight };
  }
);

// Export all actions (base + custom)
export const gameEventActions = {
  ...baseActions,
  fetchByGame,
  fetchByPeriod,
  fetchShotEvents,
  markAsHighlight
};

export default baseSlice.reducer;