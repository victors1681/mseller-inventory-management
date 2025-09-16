import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

// Initialize i18n
import "@/config/i18n";

import AuthScreen from "@/components/auth/AuthScreen";
import LoadingScreen from "@/components/auth/LoadingScreen";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { getTheme } from "@/constants/Theme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { useColorScheme } from "@/hooks/useColorScheme";

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

  // Add global error handling for production
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError(...args);
      // In production, you might want to send this to a logging service
      if (__DEV__ === false) {
        console.log("Production Error Logged:", args);
      }
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <UserProvider>
            <RootLayoutContent />
          </UserProvider>
        </AuthProvider>
      </PaperProvider>
    </ErrorBoundary>
  );
}
