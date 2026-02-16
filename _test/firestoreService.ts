import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirestoreTesting } from './FirestoreTesting';

const COLLECTION_NAME = 'firestoreTesting';

// Create
export const createFirestoreTesting = async (data: Omit<FirestoreTesting, 'id'>): Promise<FirestoreTesting> => {
  // First, create document without ID to get auto-generated ID
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    dateField: data.dateField || new Date().toISOString(),
  });

  // Then update the document to include the ID as a field
  await updateDoc(docRef, {
    id: docRef.id
  });

  return {
    id: docRef.id,
    ...data,
    dateField: data.dateField || new Date().toISOString(),
  };
};

// Read All
export const getAllFirestoreTesting = async (): Promise<FirestoreTesting[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as FirestoreTesting));
};

// Read One
export const getFirestoreTestingById = async (id: string): Promise<FirestoreTesting | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as FirestoreTesting;
  }
  return null;
};

// Update
export const updateFirestoreTesting = async (id: string, data: Partial<Omit<FirestoreTesting, 'id'>>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
};

// Delete
export const deleteFirestoreTesting = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};