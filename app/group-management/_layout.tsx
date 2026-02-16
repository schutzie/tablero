import { Stack, Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";

export default function GroupManagementLayout() {
  return (
    <Stack initialRouteName="group-management-index" screenOptions={{headerBackButtonDisplayMode: "generic"}}>
      <Stack.Screen name="group-management-index" />
      <Stack.Screen name="manage-team" />
      <Stack.Screen name="manage-player" />
    </Stack>
  );
}
