import { createCrudSlice } from './baseCrudSlice';
import { Game } from '../../model/game';

const { slice, actions } = createCrudSlice<Game>('games', 'games', 'gameId');

export const gameActions = actions;
export default slice.reducer;