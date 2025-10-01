import { createCrudSlice } from './baseCrudSlice';
import { PlayerStats } from '../../model/playerStat';

const { slice, actions } = createCrudSlice<PlayerStats>('playerStats', 'playerStats', 'playerId');

export const playerStatActions = actions;
export default slice.reducer;