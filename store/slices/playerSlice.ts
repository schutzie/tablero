import { createCrudSlice } from './baseCrudSlice';
import { Player } from '../../model/player';

const { slice, actions } = createCrudSlice<Player>('players', 'players', 'playerId');

export const playerActions = actions;
export default slice.reducer;