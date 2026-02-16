import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FirestoreTesting } from './FirestoreTesting';
import * as firestoreService from './firestoreService';

interface FirestoreTestingState {
  items: FirestoreTesting[];
  selectedItem: FirestoreTesting | null;
  loading: boolean;
  error: string | null;
}

const initialState: FirestoreTestingState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchAll = createAsyncThunk(
  'firestoreTesting/fetchAll',
  async () => {
    return await firestoreService.getAllFirestoreTesting();
  }
);

export const fetchById = createAsyncThunk(
  'firestoreTesting/fetchById',
  async (id: string) => {
    return await firestoreService.getFirestoreTestingById(id);
  }
);

export const createItem = createAsyncThunk(
  'firestoreTesting/create',
  async (data: Omit<FirestoreTesting, 'id'>) => {
    return await firestoreService.createFirestoreTesting(data);
  }
);

export const updateItem = createAsyncThunk(
  'firestoreTesting/update',
  async ({ id, data }: { id: string; data: Partial<Omit<FirestoreTesting, 'id'>> }) => {
    await firestoreService.updateFirestoreTesting(id, data);
    return { id, data };
  }
);

export const deleteItem = createAsyncThunk(
  'firestoreTesting/delete',
  async (id: string) => {
    await firestoreService.deleteFirestoreTesting(id);
    return id;
  }
);

// Slice
const firestoreTestingSlice = createSlice({
  name: 'firestoreTesting',
  initialState,
  reducers: {
    selectItem: (state, action: PayloadAction<FirestoreTesting | null>) => {
      state.selectedItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
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
        state.error = action.error.message || 'Failed to fetch items';
      });

    // Fetch By ID
    builder
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
        state.error = action.error.message || 'Failed to fetch item';
      });

    // Create
    builder
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create item';
      });

    // Update
    builder
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.data };
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update item';
      });

    // Delete
    builder
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete item';
      });
  },
});

export const { selectItem, clearError } = firestoreTestingSlice.actions;
export default firestoreTestingSlice.reducer;
