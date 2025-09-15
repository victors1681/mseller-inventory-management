import ProfileScreen from "@/components/auth/ProfileScreen";
import { useUser } from "@/contexts/UserContext";
import { useScreenTracking } from "@/services/screenTracker";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileTab() {
  const { user, userProfile } = useUser();

  // Track this screen
  useScreenTracking("profile_tab", {
    user_id: user?.uid,
    has_profile_data: !!userProfile,
    timestamp: new Date().toISOString(),
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ProfileScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
