import React, { useEffect } from 'react';
import { BaseCrudForm, FormField } from './BaseCrudForm';
import { User } from '../../model/user';
import { AccountType, UserRole, ProfileVisibility } from '../../model/enums';
import { useAppDispatch, useAppSelector } from '../../store';
import { userActions } from '../../store/slices/userSlice';

const userFormFields: FormField[] = [
  { name: 'uid', label: 'User ID', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'displayName', label: 'Display Name', type: 'text', required: true },
  { name: 'photoURL', label: 'Photo URL', type: 'text' },
  { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
  { 
    name: 'accountType', 
    label: 'Account Type', 
    type: 'select', 
    required: true,
    options: Object.values(AccountType).map(type => ({ label: type, value: type }))
  },
  { name: 'linkedPlayerId', label: 'Linked Player ID', type: 'text' },
  { 
    name: 'roles', 
    label: 'User Roles', 
    type: 'multiselect', 
    required: true,
    options: Object.values(UserRole).map(role => ({ label: role, value: role }))
  },
  { name: 'isActive', label: 'Is Active', type: 'boolean' },
];

interface UserFormProps {
  userId?: string;
  onSuccess?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ userId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { selectedItem: user, loading, error } = useAppSelector(state => state.users);

  useEffect(() => {
    if (userId) {
      dispatch(userActions.fetchById(userId));
    } else {
      dispatch(userActions.selectItem(null));
    }
  }, [userId, dispatch]);

  const handleSubmit = (data: Partial<User>) => {
    const processedData = {
      ...data,
      lastLoginAt: data.lastLoginAt || new Date().toISOString(),
      preferences: data.preferences || {
        notifications: {
          gameReminders: true,
          teamUpdates: true,
          statsAlerts: true,
          pushEnabled: true,
          emailDigest: 'weekly'
        },
        display: {
          theme: 'auto',
          language: 'en',
          timezone: 'America/New_York',
          measurementUnit: 'imperial'
        },
        privacy: {
          profileVisibility: ProfileVisibility.TEAM,
          showStats: true,
          allowTeamInvites: true
        }
      },
      followingPlayers: data.followingPlayers || [],
      followingTeams: data.followingTeams || [],
      favoriteGames: data.favoriteGames || [],
      teamRoles: data.teamRoles || {},
    };

    if (userId) {
      dispatch(userActions.update({ id: userId, data: processedData }));
    } else {
      dispatch(userActions.create(processedData));
    }
    onSuccess?.();
  };

  const handleDelete = (id: string) => {
    dispatch(userActions.remove(id));
    onSuccess?.();
  };

  return (
    <BaseCrudForm<User>
      fields={userFormFields}
      initialValues={user || undefined}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      loading={loading}
      error={error}
      title={userId ? 'Edit User' : 'Create User'}
      isEditing={!!userId}
      idField="uid"
      submitLabel={userId ? 'Update User' : 'Create User'}
    />
  );
};