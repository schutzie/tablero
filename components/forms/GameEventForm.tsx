import React, { useEffect } from 'react';
import { BaseCrudForm, FormField } from './BaseCrudForm';
import { GameEvent } from '../../model/gameEvent';
import { EventType, ShotType } from '../../model/enums';
import { useAppDispatch, useAppSelector } from '../../store';
import { gameEventActions } from '../../store/slices/gameEventSlice';

const gameEventFormFields: FormField[] = [
  { name: 'eventId', label: 'Event ID', type: 'text', required: true },
  { 
    name: 'eventType', 
    label: 'Event Type', 
    type: 'select', 
    required: true,
    options: Object.values(EventType).map(type => ({ label: type, value: type }))
  },
  { name: 'timestamp', label: 'Timestamp', type: 'date', required: true },
  { name: 'gameTime.period', label: 'Period', type: 'number', required: true },
  { name: 'gameTime.minutes', label: 'Minutes', type: 'number', required: true },
  { name: 'gameTime.seconds', label: 'Seconds', type: 'number', required: true },
  { name: 'playerId', label: 'Player ID', type: 'text' },
  { name: 'playerName', label: 'Player Name', type: 'text' },
  { name: 'teamId', label: 'Team ID', type: 'text', required: true },
  { name: 'scoreAfter.home', label: 'Home Score After', type: 'number', required: true },
  { name: 'scoreAfter.away', label: 'Away Score After', type: 'number', required: true },
  { name: 'description', label: 'Description', type: 'text', required: true, multiline: true },
  { name: 'videoURL', label: 'Video URL', type: 'text' },
  { name: 'isHighlight', label: 'Is Highlight', type: 'boolean' },
];

interface GameEventFormProps {
  eventId?: string;
  onSuccess?: () => void;
}

export const GameEventForm: React.FC<GameEventFormProps> = ({ eventId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { selectedItem: gameEvent, loading, error } = useAppSelector(state => state.gameEvents);

  useEffect(() => {
    if (eventId) {
      dispatch(gameEventActions.fetchById(eventId));
    } else {
      dispatch(gameEventActions.selectItem(null));
    }
  }, [eventId, dispatch]);

  const handleSubmit = (data: Partial<GameEvent>) => {
    const processedData = {
      ...data,
      gameTime: {
        period: data['gameTime.period'] || 1,
        minutes: data['gameTime.minutes'] || 0,
        seconds: data['gameTime.seconds'] || 0,
      },
      scoreAfter: {
        home: data['scoreAfter.home'] || 0,
        away: data['scoreAfter.away'] || 0,
      },
    };

    // Remove flattened properties
    delete processedData['gameTime.period'];
    delete processedData['gameTime.minutes'];
    delete processedData['gameTime.seconds'];
    delete processedData['scoreAfter.home'];
    delete processedData['scoreAfter.away'];

    if (eventId) {
      dispatch(gameEventActions.update({ id: eventId, data: processedData }));
    } else {
      dispatch(gameEventActions.create(processedData));
    }
    onSuccess?.();
  };

  const handleDelete = (id: string) => {
    dispatch(gameEventActions.remove(id));
    onSuccess?.();
  };

  const flattenedGameEvent = gameEvent ? {
    ...gameEvent,
    'gameTime.period': gameEvent.gameTime?.period,
    'gameTime.minutes': gameEvent.gameTime?.minutes,
    'gameTime.seconds': gameEvent.gameTime?.seconds,
    'scoreAfter.home': gameEvent.scoreAfter?.home,
    'scoreAfter.away': gameEvent.scoreAfter?.away,
  } : undefined;

  return (
    <BaseCrudForm<GameEvent>
      fields={gameEventFormFields}
      initialValues={flattenedGameEvent}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      loading={loading}
      error={error}
      title={eventId ? 'Edit Game Event' : 'Create Game Event'}
      isEditing={!!eventId}
      idField="eventId"
      submitLabel={eventId ? 'Update Game Event' : 'Create Game Event'}
    />
  );
};