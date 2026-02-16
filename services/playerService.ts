import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import {
  ref,
  getDownloadURL,
  deleteObject,
  refFromURL,
} from 'firebase/storage';
import { File as ExpoFile } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import { db, storage } from '../config/firebase';
import app from '../config/firebase';
import { Player } from '../model/player';

const COLLECTION_NAME = 'players';

// Generate a Firestore document ID without creating the document
export const generatePlayerId = (): string => {
  return doc(collection(db, COLLECTION_NAME)).id;
};

// Create with a pre-generated ID (used when photo was uploaded first)
export const createPlayerWithId = async (id: string, data: Omit<Player, 'playerId'>): Promise<Player> => {
  const now = new Date().toISOString();
  const docRef = doc(db, COLLECTION_NAME, id);
  await setDoc(docRef, {
    ...data,
    playerId: id,
    createdAt: now,
    updatedAt: now,
  });
  return { playerId: id, ...data, createdAt: now, updatedAt: now };
};

// Create
export const createPlayer = async (data: Omit<Player, 'playerId'>): Promise<Player> => {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  await updateDoc(docRef, { playerId: docRef.id });

  return {
    playerId: docRef.id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};

// Read All
export const getAllPlayers = async (): Promise<Player[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map(doc => ({
    playerId: doc.id,
    ...doc.data(),
  } as Player));
};

// Read One
export const getPlayerById = async (id: string): Promise<Player | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      playerId: docSnap.id,
      ...docSnap.data(),
    } as Player;
  }
  return null;
};

// Update
export const updatePlayer = async (id: string, data: Partial<Omit<Player, 'playerId'>>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

// Delete
export const deletePlayer = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

// Upload player photo to Firebase Storage via REST API.
// Uses expo-file-system's File class which implements the Blob interface,
// allowing it to be passed directly as a fetch body. The native layer
// handles file reading and HTTP streaming with no JS Blob/ArrayBuffer issues.
export const uploadPlayerPhoto = async (playerId: string, imageUri: string): Promise<string> => {
  const bucket = app.options.storageBucket;
  const storagePath = `players/${playerId}/photo`;
  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(storagePath)}`;

  const file = new ExpoFile(imageUri);

  // Must use expo/fetch — React Native's global fetch does not support
  // File objects as body and will send 0 bytes.
  const response = await expoFetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'image/jpeg' },
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Photo upload failed (${response.status}): ${errorText}`);
  }

  const storageRef = ref(storage, storagePath);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// Delete player photo from Firebase Storage
export const deletePlayerPhoto = async (photoURL: string): Promise<void> => {
  const storageRef = refFromURL(photoURL);
  await deleteObject(storageRef);
};
