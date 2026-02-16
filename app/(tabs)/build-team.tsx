import { StyleSheet, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import React from 'react'
import { Link } from 'expo-router'
import { Pressable } from 'react-native'

export default function BuildTeam() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Team</Text>

      <Link href="/group-management/manage-league" asChild>
        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>Manage League</Text>
        </Pressable>
      </Link>

      <Link href="/group-management/manage-team" asChild>
        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>Manage Team</Text>
        </Pressable>
      </Link>

      <Link href="/group-management/manage-player" asChild>
        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>Manage Player</Text>
        </Pressable>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  linkButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
})