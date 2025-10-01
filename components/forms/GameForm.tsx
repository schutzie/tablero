import React, { useEffect } from 'react';
import { BaseCrudForm, FormField } from './BaseCrudForm';
import { Game } from '../../model/game';
import { GameStatus, GameType } from '../../model/enums';
import { useAppDispatch, useAppSelector } from '../../store';
import { gameActions } from '../../store/slices/gameSlice';

const gameFormFields: FormField[] = [
  { name: 'gameId', label: 'Game ID', type: 'text', required: true },
  { 
    name: 'gameType', 
    label: 'Game Type', 
    type: 'select', 
    required: true,
    options: Object.values(GameType).map(type => ({ label: type, value: type }))
  },
  { name: 'homeTeam.teamId', label: 'Home Team ID', type: 'text', required: true },
  { name: 'homeTeam.name', label: 'Home Team Name', type: 'text', required: true },
  { name: 'homeTeam.logoURL', label: 'Home Team Logo URL', type: 'text' },
  { name: 'awayTeam.teamId', label: 'Away Team ID', type: 'text', required: true },
  { name: 'awayTeam.name', label: 'Away Team Name', type: 'text', required: true },
  { name: 'awayTeam.logoURL', label: 'Away Team Logo URL', type: 'text' },
  { name: 'scheduledAt', label: 'Scheduled Date', type: 'date', required: true },
  { name: 'venue', label: 'Venue', type: 'text', required: true },
  { name: 'venueAddress', label: 'Venue Address', type: 'text' },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select', 
    required: true,
    options: Object.values(GameStatus).map(status => ({ label: status, value: status }))
  },
  { name: 'currentPeriod', label: 'Current Period', type: 'number', required: true },
  { name: 'currentTime', label: 'Current Time', type: 'text', required: true },
  { name: 'isHalftime', label: 'Is Halftime', type: 'boolean' },
  { name: 'isOvertime', label: 'Is Overtime', type: 'boolean' },
  { name: 'attendance', label: 'Attendance', type: 'number' },
];

interface GameFormProps {
  gameId?: string;
  onSuccess?: () => void;
}

export const GameForm: React.FC<GameFormProps> = ({ gameId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { selectedItem: game, loading, error } = useAppSelector(state => state.games);

  useEffect(() => {
    if (gameId) {
      dispatch(gameActions.fetchById(gameId));
    } else {
      dispatch(gameActions.selectItem(null));
    }
  }, [gameId, dispatch]);

  const handleSubmit = (data: Partial<Game>) => {
    const processedData = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      score: data.score || { home: 0, away: 0, quarterScores: { home: [], away: [] } },
      homePlayers: data.homePlayers || [],
      awayPlayers: data.awayPlayers || [],
      officials: data.officials || [],
    };

    if (gameId) {
      dispatch(gameActions.update({ id: gameId, data: processedData }));
    } else {
      dispatch(gameActions.create(processedData));
    }
    onSuccess?.();
  };

  const handleDelete = (id: string) => {
    dispatch(gameActions.remove(id));
    onSuccess?.();
  };

  const flattenedGame = game ? {
    ...game,
    'homeTeam.teamId': game.homeTeam?.teamId,
    'homeTeam.name': game.homeTeam?.name,
    'homeTeam.logoURL': game.homeTeam?.logoURL,
    'awayTeam.teamId': game.awayTeam?.teamId,
    'awayTeam.name': game.awayTeam?.name,
    'awayTeam.logoURL': game.awayTeam?.logoURL,
  } : undefined;

  return (
    <BaseCrudForm<Game>
      fields={gameFormFields}
      initialValues={flattenedGame}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      loading={loading}
      error={error}
      title={gameId ? 'Edit Game' : 'Create Game'}
      isEditing={!!gameId}
      idField="gameId"
      submitLabel={gameId ? 'Update Game' : 'Create Game'}
    />
  );
};