import { db } from "../config/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { AppState } from "../model/appState";

/**
 * Firestore sync service for appState
 * Handles saving and loading appState to/from Firestore
 */

const COLLECTION_NAME = "appStates";

/**
 * Convert AppState dates to Firestore timestamps for storage
 */
const convertDatesToTimestamps = (state: AppState): DocumentData => {
  const converted: any = {
    ...state,
    metadata: {
      ...state.metadata,
      lastUpdated: Timestamp.fromDate(new Date(state.metadata.lastUpdated)),
    },
    session: {
      ...state.session,
      startedAt: Timestamp.fromDate(new Date(state.session.startedAt)),
    },
    state: {},
  };

  // Convert dates in each state entry
  Object.entries(state.state).forEach(([key, entry]) => {
    converted.state[key] = {
      ...entry,
      metadata: {
        ...entry.metadata,
        createdAt: Timestamp.fromDate(new Date(entry.metadata.createdAt)),
        updatedAt: Timestamp.fromDate(new Date(entry.metadata.updatedAt)),
      },
    };
  });

  return converted;
};

/**
 * Convert Firestore timestamps back to JavaScript dates
 */
const convertTimestampsToDates = (data: DocumentData): AppState => {
  const converted: any = {
    ...data,
    metadata: {
      ...data.metadata,
      lastUpdated: data.metadata.lastUpdated.toDate(),
    },
    session: {
      ...data.session,
      startedAt: data.session.startedAt.toDate(),
    },
    state: {},
  };

  // Convert timestamps in each state entry
  Object.entries(data.state || {}).forEach(([key, entry]: [string, any]) => {
    converted.state[key] = {
      ...entry,
      metadata: {
        ...entry.metadata,
        createdAt: entry.metadata.createdAt.toDate(),
        updatedAt: entry.metadata.updatedAt.toDate(),
      },
    };
  });

  return converted as AppState;
};

/**
 * Save appState to Firestore
 * @param userId - User ID to use as document ID
 * @param state - AppState to save
 */
export const saveAppStateToFirestore = async (
  userId: string,
  state: AppState
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const dataToSave = convertDatesToTimestamps(state);
    await setDoc(docRef, dataToSave, { merge: true });
    console.log("AppState saved to Firestore successfully");
  } catch (error) {
    console.error("Error saving appState to Firestore:", error);
    throw error;
  }
};

/**
 * Load appState from Firestore
 * @param userId - User ID to use as document ID
 * @returns AppState or null if not found
 */
export const loadAppStateFromFirestore = async (
  userId: string
): Promise<AppState | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return convertTimestampsToDates(data);
    } else {
      console.log("No appState found in Firestore");
      return null;
    }
  } catch (error) {
    console.error("Error loading appState from Firestore:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates of appState from Firestore
 * @param userId - User ID to use as document ID
 * @param callback - Function to call when appState updates
 * @returns Unsubscribe function
 */
export const subscribeToAppState = (
  userId: string,
  callback: (state: AppState | null) => void
): (() => void) => {
  const docRef = doc(db, COLLECTION_NAME, userId);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback(convertTimestampsToDates(data));
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error subscribing to appState:", error);
    }
  );
};
