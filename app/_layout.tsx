import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { SplashScreen } from "expo-router";
import { View } from "react-native";
import { Provider } from "react-redux";
import { appStore } from "../services/appStore";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // You can add any initialization logic here
        // For now, we'll just wait a brief moment
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return (
    <Provider store={appStore}>
      <View style={{ flex: 1, padding: 5, margin: 3 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </Provider>
  );
}
