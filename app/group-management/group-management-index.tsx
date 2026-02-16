import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function ManageGroup() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Team, Players, and League</Text>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  linkButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  linkText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
