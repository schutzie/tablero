import { createCrudSlice } from './baseCrudSlice';
import { Team } from '../../model/team';

const { slice, actions } = createCrudSlice<Team>('teams', 'teams', 'teamId');

export const teamActions = actions;
export default slice.reducer;