import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Scoreboard from '../../components/ui/Scoreboard';
import {
  addScore,
  addFoul,
  updateClock,
  setPeriod,
  resetScoreboard,
} from '../../services/scoreboardSlice';
import type { AppDispatch } from '../../services/appStore';
import { ColorScheme } from '../../assets/ColorScheme';

export default function ScoreboardTestScreen() {
  const dispatch = useDispatch<AppDispatch>();

  // Seed sample data on mount
  useEffect(() => {
    dispatch(setPeriod(2));
    dispatch(updateClock(347)); // 5:47
    dispatch(addScore({ team: 'home', points: 42 }));
    dispatch(addScore({ team: 'visitor', points: 38 }));
    dispatch(addFoul({ team: 'home' }));
    dispatch(addFoul({ team: 'home' }));
    dispatch(addFoul({ team: 'home' }));
    dispatch(addFoul({ team: 'visitor' }));
    dispatch(addFoul({ team: 'visitor' }));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scoreboard Test</Text>

      <Scoreboard />

      {/* Controls */}
      <View style={styles.controls}>
        {/* Scoring */}
        <Text style={styles.groupLabel}>Scoring</Text>
        <View style={styles.row}>
          <Btn label="Home +2" onPress={() => dispatch(addScore({ team: 'home', points: 2 }))} />
          <Btn label="Home +3" onPress={() => dispatch(addScore({ team: 'home', points: 3 }))} />
          <Btn label="Visitor +2" onPress={() => dispatch(addScore({ team: 'visitor', points: 2 }))} />
          <Btn label="Visitor +3" onPress={() => dispatch(addScore({ team: 'visitor', points: 3 }))} />
        </View>

        {/* Fouls */}
        <Text style={styles.groupLabel}>Fouls</Text>
        <View style={styles.row}>
          <Btn label="Home Foul" onPress={() => dispatch(addFoul({ team: 'home' }))} />
          <Btn label="Visitor Foul" onPress={() => dispatch(addFoul({ team: 'visitor' }))} />
        </View>

        {/* Clock / Period */}
        <Text style={styles.groupLabel}>Clock &amp; Period</Text>
        <View style={styles.row}>
          <Btn label="Clock 10:00" onPress={() => dispatch(updateClock(600))} />
          <Btn label="Clock 5:30" onPress={() => dispatch(updateClock(330))} />
          <Btn label="Clock 0:00" onPress={() => dispatch(updateClock(0))} />
        </View>
        <View style={styles.row}>
          <Btn label="P1" onPress={() => dispatch(setPeriod(1))} />
          <Btn label="P2" onPress={() => dispatch(setPeriod(2))} />
          <Btn label="P3" onPress={() => dispatch(setPeriod(3))} />
          <Btn label="P4" onPress={() => dispatch(setPeriod(4))} />
        </View>

        {/* Reset */}
        <View style={[styles.row, { marginTop: 10 }]}>
          <Btn label="Reset" onPress={() => dispatch(resetScoreboard())} color={ColorScheme.secondary} />
        </View>
      </View>
    </View>
  );
}

function Btn({ label, onPress, color }: { label: string; onPress: () => void; color?: string }) {
  return (
    <Pressable style={[styles.btn, color ? { backgroundColor: color } : null]} onPress={onPress}>
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controls: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  btn: {
    backgroundColor: ColorScheme.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
