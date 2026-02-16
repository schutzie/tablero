import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React, { useState } from 'react';
import { GameTimeline, GamePeriod } from '../../components/ui/GameTimeline';
import { PlayerAvatar, BadgeConfig } from '../../components/ui/PlayerAvatar';
import { Player } from '../../model/player';
import { Position, SkillLevel, TeamRole } from '../../model/helpers/enums';

export default function TestScreen() {
  const [currentTime, setCurrentTime] = useState(0);
  const [committedTime, setCommittedTime] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState('Q1');
  const [committedPeriod, setCommittedPeriod] = useState('Q1');
  const [playerListLayout, setPlayerListLayout] = useState<'horizontal' | 'vertical'>('horizontal');

  // Sample players for testing PlayerAvatar
  const samplePlayers: Player[] = [
    {
      playerId: '1',
      firstName: 'LeBron',
      lastName: 'James',
      jerseyNumber: '23',
      position: [Position.SF, Position.PF],
      height: 206,
      weight: 113,
      photoURL: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
      country: 'USA',
      yearsOfExperience: 20,
      skillLevel: SkillLevel.Professional,
      dominantHand: 'right',
      currentTeams: [],
      careerStats: {
        gamesPlayed: 1421,
        totalPoints: 38652,
        totalRebounds: 10550,
        totalAssists: 10601,
        avgPointsPerGame: 27.2,
        avgReboundsPerGame: 7.5,
        avgAssistsPerGame: 7.3,
        fieldGoalPercentage: 0.505,
        threePointPercentage: 0.345,
        freeThrowPercentage: 0.735,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
    {
      playerId: '2',
      firstName: 'Stephen',
      lastName: 'Curry',
      jerseyNumber: '30',
      position: [Position.PG],
      height: 191,
      weight: 84,
      photoURL: null, // Test default avatar
      country: 'USA',
      yearsOfExperience: 14,
      skillLevel: SkillLevel.Professional,
      dominantHand: 'right',
      currentTeams: [],
      careerStats: {
        gamesPlayed: 826,
        totalPoints: 22917,
        totalRebounds: 4322,
        totalAssists: 5733,
        avgPointsPerGame: 24.6,
        avgReboundsPerGame: 4.7,
        avgAssistsPerGame: 6.5,
        fieldGoalPercentage: 0.473,
        threePointPercentage: 0.427,
        freeThrowPercentage: 0.910,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
    {
      playerId: '3',
      firstName: 'Kevin',
      lastName: 'Durant',
      jerseyNumber: '7',
      position: [Position.SF, Position.PF],
      height: 211,
      weight: 109,
      photoURL: null,
      country: 'USA',
      yearsOfExperience: 16,
      skillLevel: SkillLevel.Professional,
      dominantHand: 'right',
      currentTeams: [],
      careerStats: {
        gamesPlayed: 1003,
        totalPoints: 27707,
        totalRebounds: 7381,
        totalAssists: 4742,
        avgPointsPerGame: 27.3,
        avgReboundsPerGame: 7.1,
        avgAssistsPerGame: 4.4,
        fieldGoalPercentage: 0.499,
        threePointPercentage: 0.386,
        freeThrowPercentage: 0.885,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
    {
      playerId: '4',
      firstName: 'Giannis',
      lastName: 'Antetokounmpo',
      jerseyNumber: '34',
      position: [Position.PF, Position.C],
      height: 211,
      weight: 110,
      photoURL: null,
      country: 'Greece',
      yearsOfExperience: 10,
      skillLevel: SkillLevel.Professional,
      dominantHand: 'right',
      currentTeams: [],
      careerStats: {
        gamesPlayed: 776,
        totalPoints: 17430,
        totalRebounds: 7842,
        totalAssists: 3555,
        avgPointsPerGame: 22.0,
        avgReboundsPerGame: 9.6,
        avgAssistsPerGame: 4.5,
        fieldGoalPercentage: 0.545,
        threePointPercentage: 0.287,
        freeThrowPercentage: 0.722,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
    {
      playerId: '5',
      firstName: 'Luka',
      lastName: 'Doncic',
      jerseyNumber: '77',
      position: [Position.PG, Position.SG],
      height: 201,
      weight: 104,
      photoURL: null,
      country: 'Slovenia',
      yearsOfExperience: 5,
      skillLevel: SkillLevel.Professional,
      dominantHand: 'right',
      currentTeams: [],
      careerStats: {
        gamesPlayed: 358,
        totalPoints: 9936,
        totalRebounds: 3141,
        totalAssists: 2652,
        avgPointsPerGame: 27.7,
        avgReboundsPerGame: 8.7,
        avgAssistsPerGame: 8.0,
        fieldGoalPercentage: 0.465,
        threePointPercentage: 0.341,
        freeThrowPercentage: 0.738,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
  ];

  // Example: 4 quarters of 12 minutes (NBA)
  const nbaQuarters: GamePeriod[] = [
    { name: 'Q1', durationMinutes: 12 },
    { name: 'Q2', durationMinutes: 12 },
    { name: 'Q3', durationMinutes: 12 },
    { name: 'Q4', durationMinutes: 12 },
  ];

  // Example: 2 halves of 20 minutes (NCAA)
  const ncaaHalves: GamePeriod[] = [
    { name: '1st Half', durationMinutes: 20 },
    { name: '2nd Half', durationMinutes: 20 },
  ];

  const handleTimeChange = (seconds: number, periodIndex: number, periodName: string) => {
    setCurrentTime(seconds);
    setCurrentPeriod(periodName);
    console.log('Time changing:', seconds, 'Period:', periodName);
  };

  const handleTimeCommit = (seconds: number, periodIndex: number, periodName: string) => {
    setCommittedTime(seconds);
    setCommittedPeriod(periodName);
    console.log('Time committed:', seconds, 'Period:', periodName);
  };

  // Helper to convert absolute time to period-relative countdown time
  const formatCountdownTime = (absoluteSeconds: number, periods: GamePeriod[]): string => {
    const absoluteMinutes = absoluteSeconds / 60;

    // Find which period we're in
    let periodIndex = 0;
    let periodStartMinutes = 0;
    let cumulativeMinutes = 0;

    for (let i = 0; i < periods.length; i++) {
      cumulativeMinutes += periods[i].durationMinutes;
      if (absoluteMinutes <= cumulativeMinutes) {
        periodIndex = i;
        periodStartMinutes = cumulativeMinutes - periods[i].durationMinutes;
        break;
      }
    }

    // Calculate countdown time within period
    const periodDurationSeconds = periods[periodIndex].durationMinutes * 60;
    const secondsIntoPeriod = absoluteSeconds - (periodStartMinutes * 60);
    const remainingSeconds = periodDurationSeconds - secondsIntoPeriod;

    const minutes = Math.floor(remainingSeconds / 60);
    const secs = Math.floor(remainingSeconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Component Test Screen</Text>

      {/* Player Avatar Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player Avatars - Active 5</Text>
        <Text style={styles.description}>
          Demonstrates 5 configurable badge positions: top-left, top-right, bottom-left, bottom-right, and center
        </Text>

        {/* Layout Toggle Buttons */}
        <View style={styles.layoutToggle}>
          <Pressable
            style={[
              styles.toggleButton,
              playerListLayout === 'horizontal' && styles.toggleButtonActive
            ]}
            onPress={() => setPlayerListLayout('horizontal')}
          >
            <Text style={[
              styles.toggleButtonText,
              playerListLayout === 'horizontal' && styles.toggleButtonTextActive
            ]}>
              Horizontal
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              playerListLayout === 'vertical' && styles.toggleButtonActive
            ]}
            onPress={() => setPlayerListLayout('vertical')}
          >
            <Text style={[
              styles.toggleButtonText,
              playerListLayout === 'vertical' && styles.toggleButtonTextActive
            ]}>
              Vertical
            </Text>
          </Pressable>
        </View>

        <View style={[
          styles.playerList,
          playerListLayout === 'vertical' && styles.playerListVertical
        ]}>
          {samplePlayers.map((player, index) => {
            // Example badge configurations - different for each player
            const getBadges = (playerIndex: number) => {
              const stats = player.careerStats;

              switch (playerIndex) {
                case 0: // LeBron - Show jersey, points, rebounds
                  return {
                    topLeft: { value: Math.floor(stats.avgPointsPerGame), backgroundColor: '#ff6b35', textColor: 'white' },
                    bottomRight: { value: player.jerseyNumber, backgroundColor: '#2C3E50', textColor: 'white' },
                  };
                case 1: // Curry - Show all 5 positions
                  return {
                    topLeft: { value: Math.floor(stats.avgPointsPerGame), backgroundColor: '#ff6b35' },
                    topRight: { value: Math.floor(stats.avgReboundsPerGame), backgroundColor: '#4ecdc4' },
                    bottomLeft: { value: Math.floor(stats.avgAssistsPerGame), backgroundColor: '#95e1d3' },
                    bottomRight: { value: player.jerseyNumber, backgroundColor: '#2C3E50' },
                    center: { value: '⭐', backgroundColor: '#ffd700', sizeMultiplier: 0.4 },
                  };
                case 2: // Durant - Show jersey and FG%
                  return {
                    topRight: { value: Math.floor(stats.fieldGoalPercentage * 100), backgroundColor: '#a8e6cf', textColor: '#333' },
                    bottomRight: { value: player.jerseyNumber, backgroundColor: '#2C3E50' },
                  };
                case 3: // Giannis - Show center badge
                  return {
                    center: { value: player.jerseyNumber, backgroundColor: '#00704a', sizeMultiplier: 0.45 },
                  };
                case 4: // Luka - Show corner badges
                  return {
                    topLeft: { value: 'P', backgroundColor: '#ff6b35' },
                    topRight: { value: 'R', backgroundColor: '#4ecdc4' },
                    bottomLeft: { value: 'A', backgroundColor: '#95e1d3' },
                    bottomRight: { value: player.jerseyNumber, backgroundColor: '#2C3E50' },
                  };
                default:
                  return {
                    bottomRight: { value: player.jerseyNumber, backgroundColor: '#2C3E50' },
                  };
              }
            };

            const badges = getBadges(index);

            return (
              <View key={player.playerId} style={styles.playerItem}>
                <PlayerAvatar
                  player={player}
                  size={80}
                  topLeftBadge={badges.topLeft}
                  topRightBadge={badges.topRight}
                  bottomLeftBadge={badges.bottomLeft}
                  bottomRightBadge={badges.bottomRight}
                  centerBadge={badges.center}
                />
                <Text style={styles.playerName}>
                  {player.firstName} {player.lastName}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Game Timeline Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Timeline - NBA (4 Quarters)</Text>

        <View style={styles.timelineContainer}>
          <GameTimeline
            periods={nbaQuarters}
            intervalSeconds={5}
            currentTime={currentTime}
            onTimeChange={handleTimeChange}
            onTimeCommit={handleTimeCommit}
            primaryColor="#2C3E50"
            secondaryColor="#E74C3C"
            height={80}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Current: {currentPeriod} - {formatCountdownTime(currentTime, nbaQuarters)}
          </Text>
          <Text style={styles.infoText}>
            Committed: {committedPeriod} - {formatCountdownTime(committedTime, nbaQuarters)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  layoutToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  toggleButtonActive: {
    backgroundColor: '#2C3E50',
    borderColor: '#2C3E50',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
  },
  playerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    gap: 20,
  },
  playerListVertical: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  playerItem: {
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  timelineContainer: {
    width: '100%',
    marginBottom: 30,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    gap: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
});
