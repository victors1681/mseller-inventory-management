import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

// Initialize i18n
import "@/config/i18n";

import AuthScreen from "@/components/auth/AuthScreen";
import LoadingScreen from "@/components/auth/LoadingScreen";
import { initializeDatadog } from "@/config/datadog";
import { getTheme } from "@/constants/Theme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ScreenTracker } from "@/services/screenTracker";

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme === "dark");

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Initialize Datadog RUM
  React.useEffect(() => {
    initializeDatadog().then((initialized) => {
      if (initialized) {
        ScreenTracker.trackScreenView("app_launch", {
          color_scheme: colorScheme,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }, [colorScheme]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <UserProvider>
          <RootLayoutContent />
        </UserProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
