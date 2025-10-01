import { createCrudSlice } from './baseCrudSlice';
import { League } from '../../model/league';

const { slice, actions } = createCrudSlice<League>('leagues', 'leagues', 'leagueId');

export const leagueActions = actions;
export default slice.reducer;