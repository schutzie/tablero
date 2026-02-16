import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Player } from '../model/player';
import * as playerService from './playerService';

interface PlayerState {
  items: Player[];
  selectedItem: Player | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchAllPlayers = createAsyncThunk(
  'players/fetchAll',
  async () => {
    return await playerService.getAllPlayers();
  }
);

export const createPlayer = createAsyncThunk(
  'players/create',
  async (data: Omit<Player, 'playerId'>) => {
    return await playerService.createPlayer(data);
  }
);

export const createPlayerWithId = createAsyncThunk(
  'players/createWithId',
  async ({ id, data }: { id: string; data: Omit<Player, 'playerId'> }) => {
    return await playerService.createPlayerWithId(id, data);
  }
);

export const updatePlayer = createAsyncThunk(
  'players/update',
  async ({ id, data }: { id: string; data: Partial<Omit<Player, 'playerId'>> }) => {
    await playerService.updatePlayer(id, data);
    return { id, data };
  }
);

export const deletePlayer = createAsyncThunk(
  'players/delete',
  async (id: string) => {
    await playerService.deletePlayer(id);
    return id;
  }
);

// Slice
const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    selectPlayer: (state, action: PayloadAction<Player | null>) => {
      state.selectedItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchAllPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch players';
      });

    // Create
    builder
      .addCase(createPlayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createPlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create player';
      });

    // Create with ID
    builder
      .addCase(createPlayerWithId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlayerWithId.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createPlayerWithId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create player';
      });

    // Update
    builder
      .addCase(updatePlayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlayer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.playerId === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.data };
        }
      })
      .addCase(updatePlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update player';
      });

    // Delete
    builder
      .addCase(deletePlayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlayer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.playerId !== action.payload);
        if (state.selectedItem?.playerId === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deletePlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete player';
      });
  },
});

export const { selectPlayer, clearError } = playerSlice.actions;
export default playerSlice.reducer;
