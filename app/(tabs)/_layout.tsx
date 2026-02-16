import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "shift",
        tabBarPosition: "top"
      }}
    >
      <Tabs.Screen
        name="build-team"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="edit-settings"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="show-settings"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="play-ball"
        options={{
          title: "Play Ball",
          animation: "fade",
          
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="basketball-hoop-outline"
              size={size}
              color={color}
            />
          ),
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: "Test",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="science" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scoreboard-test"
        options={{
          title: "Scoreboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="scoreboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="firestore-test"
        options={{ href: null }}
      />
    </Tabs>
  );
}
