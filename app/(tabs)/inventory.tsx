import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InventoryDemoScreen from "../../components/inventory/InventoryDemoScreen";
import InventoryMainScreen from "../../components/inventory/InventoryMainScreen";
import InventoryProgressScreen from "../../components/inventory/InventoryProgressScreen";
import ProductCountingScreen from "../../components/inventory/ProductCountingScreen";
import { InventarioConteo } from "../../types/inventory";

type InventoryScreenType = "demo" | "main" | "counting" | "progress";

export default function InventoryTab() {
  const [currentScreen, setCurrentScreen] =
    useState<InventoryScreenType>("main"); // Changed default from "demo" to "main"
  const [selectedConteo, setSelectedConteo] = useState<InventarioConteo | null>(
    null
  );

  const handleNavigateToCount = (conteo: InventarioConteo) => {
    setSelectedConteo(conteo);
    setCurrentScreen("counting");
  };

  const handleNavigateToProgress = (conteo: InventarioConteo) => {
    setSelectedConteo(conteo);
    setCurrentScreen("progress");
  };

  const handleNavigateToDemo = () => {
    setCurrentScreen("demo");
    setSelectedConteo(null);
  };

  const handleNavigateBack = () => {
    setCurrentScreen("main"); // Changed from "demo" to "main"
    setSelectedConteo(null);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "main":
        return (
          <InventoryMainScreen
            onNavigateToCount={handleNavigateToCount}
            onNavigateToProgress={handleNavigateToProgress}
            onNavigateToDemo={handleNavigateToDemo}
          />
        );

      case "counting":
        return selectedConteo ? (
          <ProductCountingScreen
            conteo={selectedConteo}
            onNavigateBack={handleNavigateBack}
          />
        ) : null;

      case "progress":
        return selectedConteo ? (
          <InventoryProgressScreen
            conteo={selectedConteo}
            onNavigateBack={handleNavigateBack}
          />
        ) : null;

      case "demo":
        return <InventoryDemoScreen onNavigateBack={handleNavigateBack} />;

      default:
        return (
          <InventoryMainScreen
            onNavigateToCount={handleNavigateToCount}
            onNavigateToProgress={handleNavigateToProgress}
            onNavigateToDemo={handleNavigateToDemo}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.content}>{renderCurrentScreen()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
