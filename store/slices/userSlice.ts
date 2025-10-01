import { createCrudSlice } from './baseCrudSlice';
import { User } from '../../model/user';

const { slice, actions } = createCrudSlice<User>('users', 'users', 'uid');

export const userActions = actions;
export default slice.reducer;