import { createCrudSlice } from './baseCrudSlice';
import { Notification } from '../../model/notification';

const { slice, actions } = createCrudSlice<Notification>('notifications', 'notifications', 'notificationId');

export const notificationActions = actions;
export default slice.reducer;