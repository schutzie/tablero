import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import type { AppRootState } from '../../services/appStore';
import { ColorScheme } from '../../assets/ColorScheme';

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function Scoreboard() {
  const { scoreHome, scoreVisitor, currentClockTime, currentPeriod, foulsHome, foulsVisitor } =
    useSelector((state: AppRootState) => state.scoreboard);

  return (
    <View style={styles.container}>
      {/* Home */}
      <View style={styles.teamSection}>
        <Text style={styles.teamLabel}>HOME</Text>
        <Text style={styles.score}>{scoreHome}</Text>
        <Text style={styles.fouls}>Fouls: {foulsHome}</Text>
      </View>

      {/* Clock / Period */}
      <View style={styles.centerSection}>
        <Text style={styles.clock}>{formatClock(currentClockTime)}</Text>
        <Text style={styles.period}>
          {currentPeriod != null ? `P${currentPeriod}` : '--'}
        </Text>
      </View>

      {/* Visitor */}
      <View style={styles.teamSection}>
        <Text style={styles.teamLabel}>VISITOR</Text>
        <Text style={styles.score}>{scoreVisitor}</Text>
        <Text style={styles.fouls}>Fouls: {foulsVisitor}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ColorScheme.black,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  teamSection: {
    alignItems: 'center',
    minWidth: 80,
  },
  teamLabel: {
    color: ColorScheme.light,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  score: {
    color: ColorScheme.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  fouls: {
    color: ColorScheme.secondary,
    fontSize: 10,
  },
  centerSection: {
    alignItems: 'center',
    minWidth: 90,
  },
  clock: {
    color: ColorScheme.white,
    fontSize: 22,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  period: {
    color: ColorScheme.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
