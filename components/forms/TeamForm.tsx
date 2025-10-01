import React, { useEffect } from 'react';
import { BaseCrudForm, FormField } from './BaseCrudForm';
import { Team } from '../../model/team';
import { useAppDispatch, useAppSelector } from '../../store';
import { teamActions } from '../../store/slices/teamSlice';

const teamFormFields: FormField[] = [
  { name: 'teamId', label: 'Team ID', type: 'text', required: true },
  { name: 'name', label: 'Team Name', type: 'text', required: true },
  { name: 'abbreviation', label: 'Abbreviation', type: 'text', required: true },
  { name: 'logoURL', label: 'Logo URL', type: 'text' },
  { name: 'colorPrimary', label: 'Primary Color', type: 'text', required: true },
  { name: 'colorSecondary', label: 'Secondary Color', type: 'text', required: true },
  { name: 'league', label: 'League', type: 'text' },
  { name: 'division', label: 'Division', type: 'text' },
  { name: 'conference', label: 'Conference', type: 'text' },
  { name: 'foundedYear', label: 'Founded Year', type: 'number' },
  { name: 'city', label: 'City', type: 'text', required: true },
  { name: 'state', label: 'State', type: 'text', required: true },
  { name: 'country', label: 'Country', type: 'text' },
  { name: 'homeVenue', label: 'Home Venue', type: 'text' },
  { name: 'venueCapacity', label: 'Venue Capacity', type: 'number' },
  { name: 'managerName', label: 'Manager Name', type: 'text' },
  { name: 'managerEmail', label: 'Manager Email', type: 'email' },
  { name: 'managerPhone', label: 'Manager Phone', type: 'text' },
  { name: 'isActive', label: 'Is Active', type: 'boolean' },
  { 
    name: 'visibility', 
    label: 'Visibility', 
    type: 'select',
    options: [
      { label: 'Private', value: 'private' },
      { label: 'Public', value: 'public' }
    ]
  },
];

interface TeamFormProps {
  teamId?: string;
  onSuccess?: () => void;
}

export const TeamForm: React.FC<TeamFormProps> = ({ teamId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { selectedItem: team, loading, error } = useAppSelector(state => state.teams);

  useEffect(() => {
    if (teamId) {
      dispatch(teamActions.fetchById(teamId));
    } else {
      dispatch(teamActions.selectItem(null));
    }
  }, [teamId, dispatch]);

  const handleSubmit = (data: Partial<Team>) => {
    const processedData = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roster: data.roster || [],
      coaches: data.coaches || [],
      country: data.country || 'USA',
      visibility: data.visibility || 'public',
    };

    if (teamId) {
      dispatch(teamActions.update({ id: teamId, data: processedData }));
    } else {
      dispatch(teamActions.create(processedData));
    }
    onSuccess?.();
  };

  const handleDelete = (id: string) => {
    dispatch(teamActions.remove(id));
    onSuccess?.();
  };

  return (
    <BaseCrudForm<Team>
      fields={teamFormFields}
      initialValues={team || undefined}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      loading={loading}
      error={error}
      title={teamId ? 'Edit Team' : 'Create Team'}
      isEditing={!!teamId}
      idField="teamId"
      submitLabel={teamId ? 'Update Team' : 'Create Team'}
    />
  );
};