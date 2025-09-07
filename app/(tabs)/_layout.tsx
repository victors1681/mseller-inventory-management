import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { getTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "@/hooks/useTranslation";
import { PaperProvider } from "react-native-paper";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme === "dark");
  const { t } = useTranslation();

  return (
    <PaperProvider theme={theme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("navigation.home"),
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="explore"
          options={{
            title: t("navigation.explore"),
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="inventory"
          options={{
            title: t("navigation.inventory"),
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="barcodescan.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("navigation.profile"),
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="profile.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="api-test"
          options={{
            title: t("navigation.apiTest"),
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="settings.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
