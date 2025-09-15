import ApiTestScreen from "@/components/api/ApiTestScreen";
import { useScreenTracking } from "@/services/screenTracker";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ApiTestTab() {
  // Track this screen
  useScreenTracking("api_test_tab", {
    screen_type: "testing",
    timestamp: new Date().toISOString(),
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ApiTestScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
