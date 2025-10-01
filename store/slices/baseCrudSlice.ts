import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface BaseState<T> {
  items: T[];
  selectedItem: T | null;
  loading: boolean;
  error: string | null;
}

export interface CrudActions<T> {
  fetchAll: any;
  fetchById: any;
  create: any;
  update: any;
  remove: any;
}

export const createCrudSlice = <T extends { [key: string]: any }>(
  name: string,
  collectionName: string,
  idField: string = 'id'
) => {
  const initialState: BaseState<T> = {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
  };

  const convertTimestamps = (data: DocumentData): any => {
    const converted = { ...data };
    Object.keys(converted).forEach(key => {
      if (converted[key] instanceof Timestamp) {
        converted[key] = converted[key].toDate().toISOString();
      } else if (converted[key] && typeof converted[key] === 'object' && !Array.isArray(converted[key])) {
        converted[key] = convertTimestamps(converted[key]);
      }
    });
    return converted;
  };

  const prepareForFirestore = (data: any): any => {
    const prepared = { ...data };
    delete prepared[idField];
    
    Object.keys(prepared).forEach(key => {
      if (typeof prepared[key] === 'string' && 
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(prepared[key])) {
        prepared[key] = Timestamp.fromDate(new Date(prepared[key]));
      } else if (prepared[key] && typeof prepared[key] === 'object' && !Array.isArray(prepared[key])) {
        prepared[key] = prepareForFirestore(prepared[key]);
      }
    });
    return prepared;
  };

  const fetchAll = createAsyncThunk(
    `${name}/fetchAll`,
    async (filters?: { field: string; operator: any; value: any }[]) => {
      const constraints: QueryConstraint[] = [];
      
      if (filters) {
        filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }
      
      const q = constraints.length > 0 
        ? query(collection(db, collectionName), ...constraints)
        : collection(db, collectionName);
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        [idField]: doc.id,
        ...convertTimestamps(doc.data())
      })) as T[];
    }
  );

  const fetchById = createAsyncThunk(
    `${name}/fetchById`,
    async (id: string) => {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          [idField]: docSnap.id,
          ...convertTimestamps(docSnap.data())
        } as T;
      }
      throw new Error(`${name} not found`);
    }
  );

  const create = createAsyncThunk(
    `${name}/create`,
    async (data: Omit<T, typeof idField>) => {
      const preparedData = prepareForFirestore(data);
      const docRef = await addDoc(collection(db, collectionName), preparedData);
      return {
        [idField]: docRef.id,
        ...data
      } as T;
    }
  );

  const update = createAsyncThunk(
    `${name}/update`,
    async ({ id, data }: { id: string; data: Partial<T> }) => {
      const preparedData = prepareForFirestore(data);
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, preparedData);
      return { id, changes: data };
    }
  );

  const remove = createAsyncThunk(
    `${name}/remove`,
    async (id: string) => {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return id;
    }
  );

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      selectItem: (state, action: PayloadAction<T | null>) => {
        state.selectedItem = action.payload;
      },
      clearError: (state) => {
        state.error = null;
      },
      clearSelected: (state) => {
        state.selectedItem = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAll.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchAll.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || `Failed to fetch ${name}`;
        })
        .addCase(fetchById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchById.fulfilled, (state, action) => {
          state.loading = false;
          state.selectedItem = action.payload;
        })
        .addCase(fetchById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || `Failed to fetch ${name}`;
        })
        .addCase(create.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(create.fulfilled, (state, action) => {
          state.loading = false;
          state.items.push(action.payload);
        })
        .addCase(create.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || `Failed to create ${name}`;
        })
        .addCase(update.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(update.fulfilled, (state, action) => {
          state.loading = false;
          const index = state.items.findIndex(
            item => item[idField] === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = { ...state.items[index], ...action.payload.changes };
          }
          if (state.selectedItem && state.selectedItem[idField] === action.payload.id) {
            state.selectedItem = { ...state.selectedItem, ...action.payload.changes };
          }
        })
        .addCase(update.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || `Failed to update ${name}`;
        })
        .addCase(remove.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(remove.fulfilled, (state, action) => {
          state.loading = false;
          state.items = state.items.filter(item => item[idField] !== action.payload);
          if (state.selectedItem && state.selectedItem[idField] === action.payload) {
            state.selectedItem = null;
          }
        })
        .addCase(remove.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || `Failed to delete ${name}`;
        });
    },
  });

  return {
    slice,
    actions: {
      ...slice.actions,
      fetchAll,
      fetchById,
      create,
      update,
      remove,
    },
  };
};