import React, { useEffect } from 'react';
import { BaseCrudForm, FormField } from './BaseCrudForm';
import { League } from '../../model/league';
import { LeagueType } from '../../model/enums';
import { useAppDispatch, useAppSelector } from '../../store';
import { leagueActions } from '../../store/slices/leagueSlice';

const leagueFormFields: FormField[] = [
  { name: 'leagueId', label: 'League ID', type: 'text', required: true },
  { name: 'name', label: 'League Name', type: 'text', required: true },
  { name: 'abbreviation', label: 'Abbreviation', type: 'text', required: true },
  { name: 'logoURL', label: 'Logo URL', type: 'text' },
  { 
    name: 'type', 
    label: 'League Type', 
    type: 'select', 
    required: true,
    options: Object.values(LeagueType).map(type => ({ label: type, value: type }))
  },
  { 
    name: 'level', 
    label: 'Level', 
    type: 'select', 
    required: true,
    options: [
      { label: 'Youth', value: 'youth' },
      { label: 'High School', value: 'high_school' },
      { label: 'College', value: 'college' },
      { label: 'Adult', value: 'adult' },
      { label: 'Professional', value: 'professional' }
    ]
  },
  { name: 'currentSeasonId', label: 'Current Season ID', type: 'text' },
  { name: 'seasonStartDate', label: 'Season Start Date', type: 'date' },
  { name: 'seasonEndDate', label: 'Season End Date', type: 'date' },
  { name: 'registrationDeadline', label: 'Registration Deadline', type: 'date' },
  { name: 'numberOfTeams', label: 'Number of Teams', type: 'number', required: true },
  { name: 'numberOfDivisions', label: 'Number of Divisions', type: 'number' },
  { name: 'playoffFormat', label: 'Playoff Format', type: 'text' },
  { name: 'gamesPerTeam', label: 'Games Per Team', type: 'number', required: true },
  { name: 'gameSettings.quarterLength', label: 'Quarter Length (min)', type: 'number' },
  { name: 'gameSettings.shotClock', label: 'Shot Clock (sec)', type: 'number' },
  { name: 'gameSettings.overtimeLength', label: 'Overtime Length (min)', type: 'number' },
  { name: 'gameSettings.timeoutsPerHalf', label: 'Timeouts Per Half', type: 'number' },
  { name: 'gameSettings.foulsToBonus', label: 'Fouls to Bonus', type: 'number' },
  { name: 'gameSettings.foulsToDisqualify', label: 'Fouls to Disqualify', type: 'number' },
  { name: 'commissioner', label: 'Commissioner', type: 'text' },
  { name: 'commissionerEmail', label: 'Commissioner Email', type: 'email' },
  { name: 'website', label: 'Website', type: 'text' },
  { name: 'isActive', label: 'Is Active', type: 'boolean' },
];

interface LeagueFormProps {
  leagueId?: string;
  onSuccess?: () => void;
}

export const LeagueForm: React.FC<LeagueFormProps> = ({ leagueId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { selectedItem: league, loading, error } = useAppSelector(state => state.leagues);

  useEffect(() => {
    if (leagueId) {
      dispatch(leagueActions.fetchById(leagueId));
    } else {
      dispatch(leagueActions.selectItem(null));
    }
  }, [leagueId, dispatch]);

  const handleSubmit = (data: Partial<League>) => {
    const processedData = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sport: 'basketball' as const,
      gameSettings: {
        quarterLength: data['gameSettings.quarterLength'] || 12,
        shotClock: data['gameSettings.shotClock'] || 24,
        overtimeLength: data['gameSettings.overtimeLength'] || 5,
        timeoutsPerHalf: data['gameSettings.timeoutsPerHalf'] || 3,
        foulsToBonus: data['gameSettings.foulsToBonus'] || 5,
        foulsToDisqualify: data['gameSettings.foulsToDisqualify'] || 6,
      },
      standings: data.standings || [],
    };

    // Remove flattened properties
    delete processedData['gameSettings.quarterLength'];
    delete processedData['gameSettings.shotClock'];
    delete processedData['gameSettings.overtimeLength'];
    delete processedData['gameSettings.timeoutsPerHalf'];
    delete processedData['gameSettings.foulsToBonus'];
    delete processedData['gameSettings.foulsToDisqualify'];

    if (leagueId) {
      dispatch(leagueActions.update({ id: leagueId, data: processedData }));
    } else {
      dispatch(leagueActions.create(processedData));
    }
    onSuccess?.();
  };

  const handleDelete = (id: string) => {
    dispatch(leagueActions.remove(id));
    onSuccess?.();
  };

  const flattenedLeague = league ? {
    ...league,
    'gameSettings.quarterLength': league.gameSettings?.quarterLength,
    'gameSettings.shotClock': league.gameSettings?.shotClock,
    'gameSettings.overtimeLength': league.gameSettings?.overtimeLength,
    'gameSettings.timeoutsPerHalf': league.gameSettings?.timeoutsPerHalf,
    'gameSettings.foulsToBonus': league.gameSettings?.foulsToBonus,
    'gameSettings.foulsToDisqualify': league.gameSettings?.foulsToDisqualify,
  } : undefined;

  return (
    <BaseCrudForm<League>
      fields={leagueFormFields}
      initialValues={flattenedLeague}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      loading={loading}
      error={error}
      title={leagueId ? 'Edit League' : 'Create League'}
      isEditing={!!leagueId}
      idField="leagueId"
      submitLabel={leagueId ? 'Update League' : 'Create League'}
    />
  );
};