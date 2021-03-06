import { createActionCreator } from 'commons/utils';

const ActionCreator = createActionCreator('@@LUNA/NOTIFICATIONS');

const addNotification = ActionCreator('ADD_NOTIFICATION');
const clearNotifications = ActionCreator('CLEAR_NOTIFICATIONS');
const updateNotifications = ActionCreator('UPDATE_NOTIFICATIONS');

export { updateNotifications, addNotification, clearNotifications };
