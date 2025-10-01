import React, { useEffect } from 'react';
import { BaseCrudForm, FormField } from './BaseCrudForm';
import { Notification } from '../../model/notification';
import { NotificationType } from '../../model/enums';
import { useAppDispatch, useAppSelector } from '../../store';
import { notificationActions } from '../../store/slices/notificationSlice';

const notificationFormFields: FormField[] = [
  { name: 'notificationId', label: 'Notification ID', type: 'text', required: true },
  { name: 'userId', label: 'User ID', type: 'text', required: true },
  { 
    name: 'type', 
    label: 'Notification Type', 
    type: 'select', 
    required: true,
    options: Object.values(NotificationType).map(type => ({ label: type, value: type }))
  },
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'body', label: 'Body', type: 'text', required: true, multiline: true },
  { name: 'imageURL', label: 'Image URL', type: 'text' },
  { name: 'relatedEntities.gameId', label: 'Related Game ID', type: 'text' },
  { name: 'relatedEntities.teamId', label: 'Related Team ID', type: 'text' },
  { name: 'relatedEntities.playerId', label: 'Related Player ID', type: 'text' },
  { 
    name: 'channels', 
    label: 'Delivery Channels', 
    type: 'multiselect',
    options: [
      { label: 'Push', value: 'push' },
      { label: 'Email', value: 'email' },
      { label: 'SMS', value: 'sms' },
      { label: 'In-App', value: 'in_app' }
    ]
  },
  { 
    name: 'priority', 
    label: 'Priority', 
    type: 'select',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Normal', value: 'normal' },
      { label: 'High', value: 'high' },
      { label: 'Urgent', value: 'urgent' }
    ]
  },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { label: 'Unread', value: 'unread' },
      { label: 'Read', value: 'read' },
      { label: 'Archived', value: 'archived' }
    ]
  },
  { name: 'sentAt', label: 'Sent At', type: 'date', required: true },
  { name: 'readAt', label: 'Read At', type: 'date' },
  { name: 'expiresAt', label: 'Expires At', type: 'date' },
  { 
    name: 'actionType', 
    label: 'Action Type', 
    type: 'select',
    options: [
      { label: 'Navigate', value: 'navigate' },
      { label: 'External Link', value: 'external_link' },
      { label: 'Dismiss', value: 'dismiss' }
    ]
  },
];

interface NotificationFormProps {
  notificationId?: string;
  onSuccess?: () => void;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({ notificationId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { selectedItem: notification, loading, error } = useAppSelector(state => state.notifications);

  useEffect(() => {
    if (notificationId) {
      dispatch(notificationActions.fetchById(notificationId));
    } else {
      dispatch(notificationActions.selectItem(null));
    }
  }, [notificationId, dispatch]);

  const handleSubmit = (data: Partial<Notification>) => {
    const processedData = {
      ...data,
      relatedEntities: {
        gameId: data['relatedEntities.gameId'] || null,
        teamId: data['relatedEntities.teamId'] || null,
        playerId: data['relatedEntities.playerId'] || null,
      },
      channels: data.channels || ['in_app'],
      priority: data.priority || 'normal',
      status: data.status || 'unread',
    };

    // Remove flattened properties
    delete processedData['relatedEntities.gameId'];
    delete processedData['relatedEntities.teamId'];
    delete processedData['relatedEntities.playerId'];

    if (notificationId) {
      dispatch(notificationActions.update({ id: notificationId, data: processedData }));
    } else {
      dispatch(notificationActions.create(processedData));
    }
    onSuccess?.();
  };

  const handleDelete = (id: string) => {
    dispatch(notificationActions.remove(id));
    onSuccess?.();
  };

  const flattenedNotification = notification ? {
    ...notification,
    'relatedEntities.gameId': notification.relatedEntities?.gameId,
    'relatedEntities.teamId': notification.relatedEntities?.teamId,
    'relatedEntities.playerId': notification.relatedEntities?.playerId,
  } : undefined;

  return (
    <BaseCrudForm<Notification>
      fields={notificationFormFields}
      initialValues={flattenedNotification}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      loading={loading}
      error={error}
      title={notificationId ? 'Edit Notification' : 'Create Notification'}
      isEditing={!!notificationId}
      idField="notificationId"
      submitLabel={notificationId ? 'Update Notification' : 'Create Notification'}
    />
  );
};