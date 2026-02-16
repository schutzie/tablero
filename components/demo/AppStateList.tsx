import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function AppStateList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Display</Text>
      <Text style={styles.text}>This component previously used Redux for state management.</Text>
      <Text style={styles.text}>Redux has been removed from the project.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
});
