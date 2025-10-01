import React, { useEffect } from 'react';
import { BaseCrudForm, FormField } from './BaseCrudForm';
import { PlayerStats } from '../../model/playerStat';
import { useAppDispatch, useAppSelector } from '../../store';
import { playerStatActions } from '../../store/slices/playerStatSlice';

const playerStatFormFields: FormField[] = [
  { name: 'playerId', label: 'Player ID', type: 'text', required: true },
  { name: 'playerName', label: 'Player Name', type: 'text', required: true },
  { name: 'teamId', label: 'Team ID', type: 'text', required: true },
  { name: 'jerseyNumber', label: 'Jersey Number', type: 'number', required: true },
  { name: 'starter', label: 'Starter', type: 'boolean' },
  { name: 'minutesPlayed', label: 'Minutes Played (MM:SS)', type: 'text', required: true },
  { name: 'points', label: 'Points', type: 'number' },
  { name: 'fieldGoalsMade', label: 'Field Goals Made', type: 'number' },
  { name: 'fieldGoalsAttempted', label: 'Field Goals Attempted', type: 'number' },
  { name: 'threePointersMade', label: '3-Pointers Made', type: 'number' },
  { name: 'threePointersAttempted', label: '3-Pointers Attempted', type: 'number' },
  { name: 'freeThrowsMade', label: 'Free Throws Made', type: 'number' },
  { name: 'freeThrowsAttempted', label: 'Free Throws Attempted', type: 'number' },
  { name: 'reboundsTotal', label: 'Total Rebounds', type: 'number' },
  { name: 'reboundsOffensive', label: 'Offensive Rebounds', type: 'number' },
  { name: 'reboundsDefensive', label: 'Defensive Rebounds', type: 'number' },
  { name: 'assists', label: 'Assists', type: 'number' },
  { name: 'steals', label: 'Steals', type: 'number' },
  { name: 'blocks', label: 'Blocks', type: 'number' },
  { name: 'turnovers', label: 'Turnovers', type: 'number' },
  { name: 'personalFouls', label: 'Personal Fouls', type: 'number' },
  { name: 'technicalFouls', label: 'Technical Fouls', type: 'number' },
  { name: 'flagrantFouls', label: 'Flagrant Fouls', type: 'number' },
  { name: 'fouledOut', label: 'Fouled Out', type: 'boolean' },
  { name: 'plusMinus', label: 'Plus/Minus', type: 'number' },
];

interface PlayerStatFormProps {
  playerId?: string;
  onSuccess?: () => void;
}

export const PlayerStatForm: React.FC<PlayerStatFormProps> = ({ playerId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { selectedItem: playerStat, loading, error } = useAppSelector(state => state.playerStats);

  useEffect(() => {
    if (playerId) {
      dispatch(playerStatActions.fetchById(playerId));
    } else {
      dispatch(playerStatActions.selectItem(null));
    }
  }, [playerId, dispatch]);

  const handleSubmit = (data: Partial<PlayerStats>) => {
    const processedData = {
      ...data,
      shotChartData: data.shotChartData || [],
      // Calculate percentages
      fieldGoalPercentage: data.fieldGoalsAttempted && data.fieldGoalsAttempted > 0 
        ? (data.fieldGoalsMade || 0) / data.fieldGoalsAttempted 
        : 0,
      threePointPercentage: data.threePointersAttempted && data.threePointersAttempted > 0 
        ? (data.threePointersMade || 0) / data.threePointersAttempted 
        : 0,
      freeThrowPercentage: data.freeThrowsAttempted && data.freeThrowsAttempted > 0 
        ? (data.freeThrowsMade || 0) / data.freeThrowsAttempted 
        : 0,
    };

    if (playerId) {
      dispatch(playerStatActions.update({ id: playerId, data: processedData }));
    } else {
      dispatch(playerStatActions.create(processedData));
    }
    onSuccess?.();
  };

  const handleDelete = (id: string) => {
    dispatch(playerStatActions.remove(id));
    onSuccess?.();
  };

  return (
    <BaseCrudForm<PlayerStats>
      fields={playerStatFormFields}
      initialValues={playerStat || undefined}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      loading={loading}
      error={error}
      title={playerId ? 'Edit Player Stats' : 'Create Player Stats'}
      isEditing={!!playerId}
      idField="playerId"
      submitLabel={playerId ? 'Update Player Stats' : 'Create Player Stats'}
    />
  );
};