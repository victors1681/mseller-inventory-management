import ApiTestScreen from "@/components/api/ApiTestScreen";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ApiTestTab() {
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
