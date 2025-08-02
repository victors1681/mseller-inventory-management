import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "react-native-paper";

export default function HomeScreen() {
  const theme = useTheme();
  const { user, userProfile, loading } = useUser();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: theme.colors.primary,
        dark: theme.colors.primary,
      }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          Welcome
          {userProfile?.firstName
            ? `, ${userProfile.firstName}`
            : user?.displayName
            ? `, ${user.displayName}`
            : ""}
          !
        </ThemedText>
        <HelloWave />
      </ThemedView>

      {userProfile && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Business Information</ThemedText>
          <ThemedText>
            <ThemedText type="defaultSemiBold">Company:</ThemedText>{" "}
            {userProfile.business.name}
          </ThemedText>
          <ThemedText>
            <ThemedText type="defaultSemiBold">Role:</ThemedText>{" "}
            {userProfile.type}
          </ThemedText>
          <ThemedText>
            <ThemedText type="defaultSemiBold">Mode:</ThemedText>{" "}
            {userProfile.testMode ? "Test" : "Production"}
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Getting Started</ThemedText>
        <ThemedText>
          Your inventory management system is ready to use.{" "}
          <ThemedText type="defaultSemiBold">Navigate</ThemedText> to different
          tabs to explore features.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">
            npm run reset-project
          </ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
