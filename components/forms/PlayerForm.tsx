import React, { useEffect } from 'react';
import { BaseCrudForm, FormField } from './BaseCrudForm';
import { Player } from '../../model/player';
import { Position, SkillLevel, TeamRole } from '../../model/enums';
import { useAppDispatch, useAppSelector } from '../../store';
import { playerActions } from '../../store/slices/playerSlice';

const playerFormFields: FormField[] = [
  { name: 'playerId', label: 'Player ID', type: 'text', required: true },
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
  { name: 'displayName', label: 'Display Name', type: 'text' },
  { name: 'jerseyNumber', label: 'Jersey Number', type: 'number', required: true },
  { 
    name: 'position', 
    label: 'Positions', 
    type: 'multiselect', 
    required: true,
    options: Object.values(Position).map(pos => ({ label: pos, value: pos }))
  },
  { name: 'height', label: 'Height (cm)', type: 'number', required: true },
  { name: 'weight', label: 'Weight (kg)', type: 'number', required: true },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { name: 'photoURL', label: 'Photo URL', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'state', label: 'State', type: 'text' },
  { name: 'country', label: 'Country', type: 'text' },
  { name: 'yearsOfExperience', label: 'Years of Experience', type: 'number' },
  { 
    name: 'skillLevel', 
    label: 'Skill Level', 
    type: 'select', 
    required: true,
    options: Object.values(SkillLevel).map(level => ({ label: level, value: level }))
  },
  { 
    name: 'dominantHand', 
    label: 'Dominant Hand', 
    type: 'select', 
    required: true,
    options: [
      { label: 'Right', value: 'right' },
      { label: 'Left', value: 'left' },
      { label: 'Ambidextrous', value: 'ambidextrous' }
    ]
  },
  { name: 'isActive', label: 'Is Active', type: 'boolean' },
  { name: 'linkedUserId', label: 'Linked User ID', type: 'text' },
];

interface PlayerFormProps {
  playerId?: string;
  onSuccess?: () => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ playerId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { selectedItem: player, loading, error } = useAppSelector(state => state.players);

  useEffect(() => {
    if (playerId) {
      dispatch(playerActions.fetchById(playerId));
    } else {
      dispatch(playerActions.selectItem(null));
    }
  }, [playerId, dispatch]);

  const handleSubmit = (data: Partial<Player>) => {
    const processedData = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentTeams: data.currentTeams || [],
      careerStats: data.careerStats || {
        gamesPlayed: 0,
        totalPoints: 0,
        totalRebounds: 0,
        totalAssists: 0,
        avgPointsPerGame: 0,
        avgReboundsPerGame: 0,
        avgAssistsPerGame: 0,
        fieldGoalPercentage: 0,
        threePointPercentage: 0,
        freeThrowPercentage: 0
      },
    };

    if (playerId) {
      dispatch(playerActions.update({ id: playerId, data: processedData }));
    } else {
      dispatch(playerActions.create(processedData));
    }
    onSuccess?.();
  };

  const handleDelete = (id: string) => {
    dispatch(playerActions.remove(id));
    onSuccess?.();
  };

  return (
    <BaseCrudForm<Player>
      fields={playerFormFields}
      initialValues={player || undefined}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      loading={loading}
      error={error}
      title={playerId ? 'Edit Player' : 'Create Player'}
      isEditing={!!playerId}
      idField="playerId"
      submitLabel={playerId ? 'Update Player' : 'Create Player'}
    />
  );
};