import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

export const AppStateCrud: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings (Redux removed)</Text>
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>This component previously used Redux for state management.</Text>
        <Text style={styles.infoText}>Redux has been removed from the project.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});
