import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  Card,
  Chip,
  Divider,
  IconButton,
  Paragraph,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { user, userProfile, loading } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.goodMorning");
    if (hour < 18) return t("dashboard.goodAfternoon");
    return t("dashboard.goodEvening");
  };

  const getUserName = () => {
    if (userProfile?.firstName) return userProfile.firstName;
    if (user?.displayName) return user.displayName;
    return "Usuario";
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const quickActions = [
    {
      id: "search",
      title: t("dashboard.searchProducts"),
      icon: "magnify",
      color: theme.colors.primary,
      onPress: () => router.push("/(tabs)/products"),
    },
    {
      id: "inventory",
      title: t("dashboard.viewInventory"),
      icon: "package-variant",
      color: theme.colors.secondary,
      onPress: () => router.push("/(tabs)/inventory"),
    },
    {
      id: "profile",
      title: t("navigation.profile"),
      icon: "account",
      color: theme.colors.tertiary,
      onPress: () => router.push("/(tabs)/profile"),
    },
  ];

  const features = [
    {
      id: "products",
      title: t("dashboard.productManagement"),
      description: t("dashboard.productManagementDesc"),
      icon: "barcode-scan",
      color: theme.colors.primary,
    },
    {
      id: "inventory",
      title: t("dashboard.inventoryTracking"),
      description: t("dashboard.inventoryTrackingDesc"),
      icon: "clipboard-list",
      color: theme.colors.secondary,
    },
    {
      id: "labels",
      title: t("dashboard.labelPrinting"),
      description: t("dashboard.labelPrintingDesc"),
      icon: "qr-code",
      color: theme.colors.tertiary,
    },
  ];

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <Card style={[styles.card, styles.welcomeCard]}>
          <Card.Content>
            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeText}>
                <Text
                  style={[styles.greeting, { color: theme.colors.onSurface }]}
                >
                  {getGreeting()}
                </Text>
                <Text
                  variant="titleLarge"
                  style={[styles.userName, { color: theme.colors.primary }]}
                >
                  {getUserName()}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {t("dashboard.subtitle")}
                </Text>
              </View>
              {user?.photoURL ? (
                <Avatar.Image
                  size={60}
                  source={{ uri: user.photoURL }}
                  style={styles.avatarIcon}
                />
              ) : (
                <Avatar.Text
                  size={60}
                  label={getInitials(getUserName())}
                  style={styles.avatarIcon}
                />
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Business Information */}
        {userProfile && (
          <Card style={styles.card}>
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[styles.sectionTitle, { color: theme.colors.primary }]}
              >
                <IconButton
                  icon="domain"
                  size={20}
                  iconColor={theme.colors.primary}
                />
                {t("dashboard.businessInfo")}
              </Text>
              <Surface style={styles.infoRow} elevation={0}>
                <Text style={styles.infoLabel}>Empresa:</Text>
                <Text style={styles.infoValue}>
                  {userProfile.business.name}
                </Text>
              </Surface>
              <Surface style={styles.infoRow} elevation={0}>
                <Text style={styles.infoLabel}>Rol:</Text>
                <Text style={styles.infoValue}>{userProfile.type}</Text>
              </Surface>
              <Surface style={styles.infoRow} elevation={0}>
                <Text style={styles.infoLabel}>Modo:</Text>
                <Chip
                  icon={userProfile.testMode ? "test-tube" : "check-circle"}
                  compact
                  style={[
                    styles.modeChip,
                    {
                      backgroundColor: userProfile.testMode
                        ? theme.colors.tertiary + "20"
                        : theme.colors.primaryContainer,
                    },
                  ]}
                >
                  {userProfile.testMode ? "Pruebas" : "Producción"}
                </Chip>
              </Surface>
            </Card.Content>
          </Card>
        )}

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              <IconButton
                icon="lightning-bolt"
                size={20}
                iconColor={theme.colors.primary}
              />
              {t("dashboard.quickActions")}
            </Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionCard,
                    { backgroundColor: action.color + "15" },
                  ]}
                  onPress={action.onPress}
                >
                  <IconButton
                    icon={action.icon}
                    size={32}
                    iconColor={action.color}
                    style={styles.actionIcon}
                  />
                  <Text style={[styles.actionTitle, { color: action.color }]}>
                    {action.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Features Overview */}
        <Card style={styles.card}>
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              <IconButton
                icon="star"
                size={20}
                iconColor={theme.colors.primary}
              />
              {t("dashboard.getStarted")}
            </Text>
            <Paragraph
              style={[
                styles.featuresDescription,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {t("dashboard.exploreFeatures")}
            </Paragraph>
            <Divider style={styles.divider} />
            {features.map((feature, index) => (
              <View key={feature.id}>
                <Surface style={styles.featureRow} elevation={0}>
                  <IconButton
                    icon={feature.icon}
                    size={24}
                    iconColor={feature.color}
                    style={[
                      styles.featureIcon,
                      { backgroundColor: feature.color + "15" },
                    ]}
                  />
                  <View style={styles.featureContent}>
                    <Text
                      style={[
                        styles.featureTitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {feature.title}
                    </Text>
                    <Text
                      style={[
                        styles.featureDescription,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {feature.description}
                    </Text>
                  </View>
                </Surface>
                {index < features.length - 1 && (
                  <Divider style={styles.featureDivider} />
                )}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* System Status */}
        <Card style={styles.card}>
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              <IconButton
                icon="server-network"
                size={20}
                iconColor={theme.colors.primary}
              />
              {t("dashboard.systemStatus")}
            </Text>
            <View style={styles.statusGrid}>
              <Surface style={styles.statusCard} elevation={0}>
                <IconButton
                  icon="wifi"
                  size={24}
                  iconColor={theme.colors.primary}
                />
                <Text style={styles.statusLabel}>Conexión</Text>
                <Chip icon="check" compact style={styles.statusChip}>
                  Activa
                </Chip>
              </Surface>
              <Surface style={styles.statusCard} elevation={0}>
                <IconButton
                  icon="database"
                  size={24}
                  iconColor={theme.colors.secondary}
                />
                <Text style={styles.statusLabel}>Base de Datos</Text>
                <Chip icon="check" compact style={styles.statusChip}>
                  Online
                </Chip>
              </Surface>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 0, // Remove bottom padding to eliminate gap above tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  welcomeCard: {
    backgroundColor: "#f8f9fa",
  },
  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 14,
    fontStyle: "italic",
  },
  avatarIcon: {
    margin: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  modeChip: {
    alignSelf: "flex-end",
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 100,
    justifyContent: "center",
  },
  actionIcon: {
    margin: 0,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  featuresDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  divider: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 8,
  },
  featureIcon: {
    margin: 0,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  featureDivider: {
    marginVertical: 8,
  },
  statusGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statusCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 8,
    textAlign: "center",
  },
  statusChip: {
    backgroundColor: "#e8f5e8",
  },
});
