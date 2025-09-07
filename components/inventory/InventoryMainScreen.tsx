import { isAxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  FAB,
  IconButton,
  Paragraph,
  ProgressBar,
  Snackbar,
  Title,
  useTheme,
} from "react-native-paper";
import { CustomTheme } from "../../constants/Theme";
import { useUser } from "../../contexts/UserContext";
import { useTranslation } from "../../hooks/useTranslation";
import {
  inventoryService,
  offlineManager,
} from "../../services/inventoryService";
import {
  EstadoConteo,
  InventarioConteo,
  ResumenConteo,
} from "../../types/inventory";

interface InventoryMainScreenProps {
  onNavigateToCount: (conteo: InventarioConteo) => void;
  onNavigateToProgress: (conteo: InventarioConteo) => void;
  onNavigateToDemo?: () => void; // Add optional demo navigation
}

const InventoryMainScreen: React.FC<InventoryMainScreenProps> = ({
  onNavigateToCount,
  onNavigateToProgress,
  onNavigateToDemo,
}) => {
  const { userProfile } = useUser();
  const { t } = useTranslation();
  const theme = useTheme() as CustomTheme;

  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeCount, setActiveCount] = useState<InventarioConteo | null>(null);
  const [allCounts, setAllCounts] = useState<InventarioConteo[]>([]);
  const [countSummary, setCountSummary] = useState<ResumenConteo | null>(null);
  const [offlineOperationsCount, setOfflineOperationsCount] = useState(0);

  // Get warehouse ID from user profile
  const warehouseId = userProfile?.warehouse
    ? inventoryService.getWarehouseId(userProfile.warehouse)
    : null;

  const loadData = useCallback(async () => {
    if (!warehouseId) return;

    try {
      setError("");

      // Load active count and all counts in parallel
      const [activeCountData, allCountsData] = await Promise.all([
        inventoryService.getConteoActivo(warehouseId),
        inventoryService.getConteosActivos(warehouseId),
      ]);

      setActiveCount(activeCountData);
      setAllCounts(allCountsData);

      // Load summary if there's an active count
      if (activeCountData) {
        const summary = await inventoryService.getResumenConteo(
          activeCountData.id
        );
        setCountSummary(summary);
      } else {
        setCountSummary(null);
      }

      // Update offline operations count
      const offlineCount = await offlineManager.getPendingOperationsCount();
      setOfflineOperationsCount(offlineCount);
    } catch (err: any) {
      if (isAxiosError(err)) {
        console.error("Axios error loading inventory data:", err.request);
      }
      console.error("Error loading inventory data:", err);
      setError(
        err.response?.data?.message || err.message || t("errors.genericError")
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [warehouseId, t]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleSyncOfflineData = async () => {
    if (offlineOperationsCount === 0) return;

    setLoading(true);
    setError("");

    try {
      const result = await offlineManager.syncPendingOperations(
        inventoryService
      );

      if (result.success > 0) {
        setSuccess(
          t("inventory.syncSuccess") +
            ` (${result.success} ${t("common.success").toLowerCase()})`
        );
        setOfflineOperationsCount(0);
        // Reload data to reflect changes
        await loadData();
      }

      if (result.failed > 0) {
        setError(
          `${t("inventory.syncFailed")}: ${result.failed} operations failed`
        );
      }
    } catch (err: any) {
      console.error("Error syncing offline data:", err);
      setError(err.message || t("errors.networkError"));
    } finally {
      setLoading(false);
    }
  };

  const getCountStatusColor = (estado: EstadoConteo) => {
    switch (estado) {
      case EstadoConteo.EnProgreso:
        return theme.colors.primary;
      case EstadoConteo.Completado:
        return theme.colors.secondary;
      case EstadoConteo.Reconciliado:
        return theme.colors.tertiary;
      case EstadoConteo.Planificado:
        return theme.colors.outline;
      default:
        return theme.colors.error;
    }
  };

  const getCountStatusText = (estado: EstadoConteo) => {
    switch (estado) {
      case EstadoConteo.Planificado:
        return "Planificado";
      case EstadoConteo.EnProgreso:
        return "En Progreso";
      case EstadoConteo.Completado:
        return "Completado";
      case EstadoConteo.Reconciliado:
        return "Reconciliado";
      case EstadoConteo.Cancelado:
        return "Cancelado";
      default:
        return estado;
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!userProfile) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Title>{t("common.loading")}</Title>
      </View>
    );
  }

  if (!warehouseId) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Title style={{ color: theme.colors.error }}>
          {t("errors.genericError")}
        </Title>
        <Paragraph>Invalid warehouse configuration</Paragraph>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.headerInfo}>
                <Title style={{ color: theme.colors.primary }}>
                  {t("inventory.inventoryCount")} {t("inventory.mobile")}
                </Title>
                <Paragraph style={{ color: theme.colors.onSurface }}>
                  {t("inventory.warehouse")}: {userProfile.warehouse}
                </Paragraph>
              </View>
              <View style={styles.headerActions}>
                {onNavigateToDemo && (
                  <IconButton
                    icon="information"
                    size={24}
                    onPress={onNavigateToDemo}
                    iconColor={theme.colors.secondary}
                  />
                )}
                <IconButton
                  icon="refresh"
                  size={24}
                  onPress={handleRefresh}
                  disabled={loading}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Offline Operations Alert */}
        {offlineOperationsCount > 0 && (
          <Card style={[styles.card, styles.warningCard]}>
            <Card.Content>
              <View style={styles.offlineAlert}>
                <View style={styles.offlineInfo}>
                  <Title style={{ color: theme.colors.secondary }}>
                    {t("inventory.offlineOperations")}
                  </Title>
                  <Paragraph>
                    {offlineOperationsCount} operations pending sync
                  </Paragraph>
                </View>
                <Button
                  mode="contained"
                  onPress={handleSyncOfflineData}
                  loading={loading}
                  disabled={loading}
                >
                  {t("inventory.syncOfflineData")}
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Active Count Section */}
        {activeCount ? (
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <View style={styles.activeCountHeader}>
                <Title style={{ color: theme.colors.primary }}>
                  {t("inventory.activeCount")}
                </Title>
                <Chip
                  icon="clipboard-check"
                  style={{
                    backgroundColor: getCountStatusColor(activeCount.estado),
                  }}
                  textStyle={{ color: theme.colors.onPrimary }}
                >
                  {getCountStatusText(activeCount.estado)}
                </Chip>
              </View>

              <Paragraph style={styles.countDescription}>
                {activeCount.descripcion}
              </Paragraph>

              {countSummary && (
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                      {t("inventory.countProgress")}
                    </Paragraph>
                    <Paragraph style={{ color: theme.colors.primary }}>
                      {countSummary.productosContados} /{" "}
                      {countSummary.totalProductos}
                    </Paragraph>
                  </View>
                  <ProgressBar
                    progress={countSummary.porcentajeCompletado / 100}
                    color={theme.colors.primary}
                    style={styles.progressBar}
                  />
                  <Paragraph style={styles.progressText}>
                    {countSummary.porcentajeCompletado.toFixed(1)}%{" "}
                    {t("common.completed")}
                  </Paragraph>
                </View>
              )}

              <Divider style={styles.divider} />

              <View style={styles.actionButtons}>
                <Button
                  mode="contained"
                  icon="barcode-scan"
                  onPress={() => onNavigateToCount(activeCount)}
                  style={styles.actionButton}
                  disabled={activeCount.estado === EstadoConteo.Completado}
                >
                  {t("inventory.startCounting")}
                </Button>
                <Button
                  mode="outlined"
                  icon="chart-line"
                  onPress={() => onNavigateToProgress(activeCount)}
                  style={styles.actionButton}
                >
                  {t("inventory.countProgress")}
                </Button>
              </View>
            </Card.Content>
          </Card>
        ) : (
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content style={styles.noActiveCount}>
              <Title style={{ color: theme.colors.onSurfaceVariant }}>
                {t("inventory.noActiveCount")}
              </Title>
              <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                No hay conteos activos en este almacén
              </Paragraph>
            </Card.Content>
          </Card>
        )}

        {/* Recent Counts */}
        {allCounts.length > 0 && (
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Title
                style={{ color: theme.colors.onSurface, marginBottom: 16 }}
              >
                Conteos Recientes
              </Title>
              {allCounts.slice(0, 5).map((conteo) => (
                <View key={conteo.id} style={styles.countItem}>
                  <View style={styles.countItemInfo}>
                    <Paragraph style={{ fontWeight: "bold" }}>
                      {conteo.descripcion}
                    </Paragraph>
                    <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                      {new Date(conteo.fechaCreacion).toLocaleDateString()}
                    </Paragraph>
                  </View>
                  <Chip
                    style={{
                      backgroundColor: getCountStatusColor(conteo.estado),
                    }}
                    textStyle={{ color: theme.colors.onPrimary }}
                  >
                    {getCountStatusText(conteo.estado)}
                  </Chip>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {activeCount && activeCount.estado === EstadoConteo.EnProgreso && (
        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          icon="barcode-scan"
          onPress={() => onNavigateToCount(activeCount)}
          label={t("inventory.countProduct")}
        />
      )}

      {/* Snackbars */}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError("")}
        duration={4000}
        action={{
          label: t("common.retry"),
          onPress: () => {
            setError("");
            loadData();
          },
        }}
      >
        {error}
      </Snackbar>

      <Snackbar
        visible={!!success}
        onDismiss={() => setSuccess("")}
        duration={3000}
      >
        {success}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FFA726",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  offlineAlert: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offlineInfo: {
    flex: 1,
    marginRight: 16,
  },
  activeCountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  countDescription: {
    marginBottom: 16,
    fontStyle: "italic",
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressText: {
    textAlign: "center",
    fontSize: 12,
  },
  divider: {
    marginVertical: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  noActiveCount: {
    alignItems: "center",
    paddingVertical: 24,
  },
  countItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  countItemInfo: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default InventoryMainScreen;
