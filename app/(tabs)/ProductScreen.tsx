import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Paragraph,
  SegmentedButtons,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useBarcodeScanner } from "../../hooks/useBarcodeScanner";
import { useTranslation } from "../../hooks/useTranslation";
import {
  searchProducts,
  searchProductsByCode,
  searchProductsByText,
} from "../../services/ProductService";
import { ZebraLabelService } from "../../services/zebraLabelService";
import type { Product } from "../../types/inventory";

type SearchType = "barcode" | "code" | "text";

const ProductScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("barcode");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[] | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [isAutoSearching, setIsAutoSearching] = useState(false);
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);

  // Barcode scanner detection (legacy - for backwards compatibility)
  const barcodeBuffer = useRef("");
  const barcodeTimeout = useRef<any>(null);
  const lastInputTime = useRef(0);

  const performSearch = useCallback(
    async (value: string = searchValue, type: SearchType = searchType) => {
      if (!value.trim()) return;

      setLoading(true);
      setError("");
      setResults(null);
      setSelected(null);
      try {
        let data;
        switch (type) {
          case "barcode":
            data = await searchProducts(value);
            break;
          case "code":
            data = await searchProductsByCode(value);
            break;
          case "text":
            data = await searchProductsByText(value);
            break;
          default:
            data = await searchProducts(value);
        }
        setResults(data.data);

        // If no products found, show a friendly message
        if (data.data.length === 0) {
          setError(t("errors.noProductsFoundMessage"));
        }
      } catch (e: any) {
        // Handle different types of errors with user-friendly messages
        if (e.response?.status === 404 || e.message?.includes("404")) {
          setError(t("errors.productNotFoundMessage"));
        } else if (
          e.message?.includes("Network Error") ||
          e.message?.includes("network")
        ) {
          setError(t("errors.networkError"));
        } else if (e.message?.includes("timeout")) {
          setError(t("errors.timeoutError"));
        } else {
          setError(e.message || t("errors.genericError"));
        }
      } finally {
        setLoading(false);
      }
    },
    [searchValue, searchType, t]
  );

  // Barcode scanner hook callback
  const handleBarcodeScanned = useCallback(
    (scannedData: string) => {
      console.log("Barcode scanned in ProductScreen:", scannedData);

      // Set search type to barcode and update search value
      setSearchType("barcode");
      setSearchValue(scannedData);

      // Trigger search automatically
      setIsAutoSearching(true);
      performSearch(scannedData, "barcode").finally(() => {
        setIsAutoSearching(false);
      });
    },
    [performSearch]
  );

  // Initialize barcode scanner hook
  const { isReady: scannerReady, isScanning } = useBarcodeScanner({
    onScan: handleBarcodeScanned,
    enabled: searchType === "barcode",
    minLength: 3,
  });

  // Enhanced text input handler with barcode detection
  const handleTextChange = (text: string) => {
    setSearchValue(text);

    // Only do barcode detection for barcode search type
    if (searchType !== "barcode") return;

    const currentTime = Date.now();
    const timeDiff = currentTime - lastInputTime.current;

    // Clear previous timeout
    if (barcodeTimeout.current) {
      clearTimeout(barcodeTimeout.current);
    }

    // If time between characters is less than 50ms, it's likely a scanner
    if (timeDiff < 50 && barcodeBuffer.current.length > 0) {
      barcodeBuffer.current += text.slice(-1); // Only add the last character
    } else {
      barcodeBuffer.current = text;
    }

    lastInputTime.current = currentTime;

    // Set timeout to process the barcode
    barcodeTimeout.current = setTimeout(() => {
      const potentialBarcode = text.trim();

      // Check if it looks like a barcode (numeric, reasonable length)
      if (potentialBarcode.length >= 8 && /^\d+$/.test(potentialBarcode)) {
        // Show auto-search indicator
        setIsAutoSearching(true);
        // Auto-search when barcode is detected
        performSearch(potentialBarcode, "barcode").finally(() => {
          setIsAutoSearching(false);
        });
      }

      barcodeBuffer.current = "";
    }, 300);
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (barcodeTimeout.current) {
        clearTimeout(barcodeTimeout.current);
      }
    };
  }, []);

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case "barcode":
        return "Código de Barras";
      case "code":
        return "Código del Producto";
      case "text":
        return "Nombre del Producto";
      default:
        return "Código de Barras";
    }
  };

  const getKeyboardType = () => {
    return searchType === "text" ? "default" : "numeric";
  };

  const handleCreateLabel = async () => {
    if (!selected) return;

    setIsCreatingLabel(true);
    try {
      // Get available printers
      const printers = await ZebraLabelService.getAvailablePrinters();

      if (printers.length === 0) {
        Alert.alert(
          "Sin Impresoras",
          "No se encontraron impresoras disponibles. Asegúrate de que tu impresora Zebra esté conectada.",
          [{ text: "OK" }]
        );
        return;
      }

      // For now, use the first available printer
      // In a production app, you might want to let users choose
      const selectedPrinter = printers[0];

      // Generate ZPL label data
      const zplData = ZebraLabelService.generateProductLabel(selected);

      // Show preview and confirm
      Alert.alert(
        t("inventory.createLabel"),
        `¿Deseas imprimir la etiqueta para "${
          selected.nombre
        }"?\n\nImpresora: ${selectedPrinter.type.toUpperCase()}${
          selectedPrinter.address ? ` (${selectedPrinter.address})` : ""
        }`,
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Vista Previa",
            onPress: () => {
              // Show ZPL preview
              Alert.alert("Vista Previa ZPL", zplData, [{ text: "OK" }]);
            },
          },
          {
            text: "Imprimir",
            onPress: async () => {
              const result = await ZebraLabelService.printLabel(
                zplData,
                selectedPrinter
              );

              Alert.alert(result.success ? "Éxito" : "Error", result.message, [
                { text: "OK" },
              ]);
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al crear la etiqueta", [
        { text: "OK" },
      ]);
    } finally {
      setIsCreatingLabel(false);
    }
  };

  if (selected) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Product Name and Back Button */}
          <View style={styles.headerContainer}>
            <IconButton
              icon="arrow-left"
              iconColor={theme.colors.primary}
              size={24}
              onPress={() => setSelected(null)}
              style={styles.backButton}
            />
            <Text
              variant="titleLarge"
              style={[styles.headerTitle, { color: theme.colors.primary }]}
            >
              Detalles del Producto
            </Text>
          </View>

          {/* Product Name Card */}
          <Card style={[styles.card, styles.productNameCard]}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.productName}>
                {selected.nombre}
              </Text>
              {selected.descripcion && (
                <Text style={styles.productDescription}>
                  {selected.descripcion}
                </Text>
              )}
              <View style={styles.statusContainer}>
                <Chip
                  icon="check-circle"
                  mode="outlined"
                  compact
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor:
                        selected.status === "A"
                          ? theme.colors.primaryContainer
                          : theme.colors.errorContainer,
                    },
                  ]}
                >
                  {selected.status === "A" ? "Activo" : "Inactivo"}
                </Chip>
                {selected.promocion && (
                  <Chip
                    icon="sale"
                    mode="outlined"
                    compact
                    style={[
                      styles.statusChip,
                      { backgroundColor: theme.colors.tertiary + "20" },
                    ]}
                  >
                    En Promoción
                  </Chip>
                )}
                {selected.esServicio && (
                  <Chip
                    icon="cog"
                    mode="outlined"
                    compact
                    style={styles.statusChip}
                  >
                    Servicio
                  </Chip>
                )}
              </View>
            </Card.Content>
          </Card>

          {/* Product Codes Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                <IconButton
                  icon="barcode"
                  size={20}
                  iconColor={theme.colors.primary}
                />
                Códigos
              </Text>
              <Surface style={styles.infoRow} elevation={0}>
                <Text style={styles.infoLabel}>Código:</Text>
                <Text style={styles.infoValue}>{selected.codigo}</Text>
              </Surface>
              <Surface style={styles.infoRow} elevation={0}>
                <Text style={styles.infoLabel}>Código de Barra:</Text>
                <Text style={styles.infoValue}>{selected.codigoBarra}</Text>
              </Surface>
            </Card.Content>
          </Card>

          {/* Product Details Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                <IconButton
                  icon="information"
                  size={20}
                  iconColor={theme.colors.primary}
                />
                Información General
              </Text>
              <Surface style={styles.infoRow} elevation={0}>
                <Text style={styles.infoLabel}>Área:</Text>
                <Text style={styles.infoValue}>{selected.area}</Text>
              </Surface>
              <Surface style={styles.infoRow} elevation={0}>
                <Text style={styles.infoLabel}>Departamento:</Text>
                <Text style={styles.infoValue}>{selected.departamento}</Text>
              </Surface>
              <Surface style={styles.infoRow} elevation={0}>
                <Text style={styles.infoLabel}>Unidad:</Text>
                <Text style={styles.infoValue}>{selected.unidad}</Text>
              </Surface>
              <Surface style={styles.infoRow} elevation={0}>
                <Text style={styles.infoLabel}>Empaque:</Text>
                <Text style={styles.infoValue}>{selected.empaque}</Text>
              </Surface>
            </Card.Content>
          </Card>

          {/* Pricing Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                <IconButton
                  icon="currency-usd"
                  size={20}
                  iconColor={theme.colors.primary}
                />
                Precios
              </Text>
              <Surface style={styles.priceRow} elevation={0}>
                <Text style={styles.priceLabel}>Precio 1:</Text>
                <Text style={[styles.priceValue, styles.mainPrice]}>
                  ${selected.precio1.toFixed(2)}
                </Text>
              </Surface>
              {selected.precio2 > 0 && (
                <Surface style={styles.priceRow} elevation={0}>
                  <Text style={styles.priceLabel}>Precio 2:</Text>
                  <Text style={styles.priceValue}>
                    ${selected.precio2.toFixed(2)}
                  </Text>
                </Surface>
              )}
              {selected.precio3 > 0 && (
                <Surface style={styles.priceRow} elevation={0}>
                  <Text style={styles.priceLabel}>Precio 3:</Text>
                  <Text style={styles.priceValue}>
                    ${selected.precio3.toFixed(2)}
                  </Text>
                </Surface>
              )}
              <Divider style={styles.priceDivider} />
              {/* <Surface style={styles.priceRow} elevation={0}>
              <Text style={styles.priceLabel}>Costo:</Text>
              <Text style={[styles.priceValue, styles.costPrice]}>
                ${selected.costo.toFixed(2)}
              </Text>
            </Surface> */}
            </Card.Content>
          </Card>

          {/* Stock Information Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                <IconButton
                  icon="package-variant"
                  size={20}
                  iconColor={theme.colors.primary}
                />
                Existencias por Localidad
              </Text>
              {selected.existencias.map((ex) => {
                const stockLevel = ex.existencia;
                const stockColor =
                  stockLevel <= 0
                    ? theme.colors.error
                    : stockLevel <= 5
                    ? theme.colors.tertiary
                    : theme.colors.primary;

                return (
                  <Surface key={ex.id} style={styles.stockRow} elevation={0}>
                    <View style={styles.stockInfo}>
                      <Text style={styles.locationName}>
                        {ex.localidadNombre}
                      </Text>
                      <Text style={styles.lastUpdated}>
                        Última actualización:{" "}
                        {new Date(ex.ultimaActualizacion).toLocaleDateString()}
                      </Text>
                    </View>
                    <Chip
                      icon={
                        stockLevel <= 0
                          ? "alert-circle"
                          : stockLevel <= 5
                          ? "alert"
                          : "check"
                      }
                      style={[
                        styles.stockChip,
                        { backgroundColor: stockColor + "20" },
                      ]}
                      textStyle={{ color: stockColor, fontWeight: "bold" }}
                    >
                      {ex.existencia}
                    </Chip>
                  </Surface>
                );
              })}
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <Card style={styles.card}>
            <Card.Content>
              <Button
                mode="contained"
                style={styles.actionButton}
                icon="qr-code"
                onPress={handleCreateLabel}
                loading={isCreatingLabel}
                disabled={isCreatingLabel}
              >
                {t("inventory.createLabel")}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
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
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Búsqueda de Productos</Text>

            {/* Search Type Selector */}
            <SegmentedButtons
              value={searchType}
              onValueChange={(value) => setSearchType(value as SearchType)}
              buttons={[
                {
                  value: "barcode",
                  label: "Código Barra",
                  icon: "barcode-scan",
                },
                {
                  value: "code",
                  label: "Código",
                  icon: "barcode-off",
                },
                {
                  value: "text",
                  label: "Texto",
                  icon: "format-text",
                },
              ]}
              style={{ marginBottom: 16 }}
            />

            {/* Scanner Status */}
            {searchType === "barcode" && scannerReady && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Chip
                  icon={isScanning ? "loading" : "barcode-scan"}
                  style={{
                    backgroundColor: isScanning
                      ? theme.colors.secondary
                      : theme.colors.primaryContainer,
                  }}
                  textStyle={{ fontSize: 12 }}
                >
                  {isScanning ? "Scanning..." : "Scanner Ready"}
                </Chip>
              </View>
            )}

            <TextInput
              label={getSearchPlaceholder()}
              value={searchValue}
              onChangeText={handleTextChange}
              keyboardType={getKeyboardType()}
              style={{ marginBottom: 12 }}
              left={
                searchType === "barcode" ? (
                  <TextInput.Icon icon="barcode-scan" />
                ) : searchType === "code" ? (
                  <TextInput.Icon icon="barcode-off" />
                ) : (
                  <TextInput.Icon icon="format-text" />
                )
              }
              right={
                searchValue ? (
                  <TextInput.Icon
                    icon="close-circle"
                    onPress={() => {
                      setSearchValue("");
                      setResults(null);
                      setError("");
                    }}
                  />
                ) : null
              }
            />
            <Button
              mode="contained"
              onPress={() => performSearch()}
              loading={loading || isAutoSearching}
              disabled={!searchValue.trim() || loading || isAutoSearching}
            >
              {isAutoSearching ? "Búsqueda automática..." : "Buscar"}
            </Button>
            {error ? (
              <Card
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.errorContainer,
                    marginTop: 12,
                  },
                ]}
              >
                <Card.Content>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <IconButton
                      icon="alert-circle-outline"
                      size={24}
                      iconColor={theme.colors.error}
                      style={{ margin: 0 }}
                    />
                    <Text
                      variant="titleMedium"
                      style={{ color: theme.colors.error, flex: 1 }}
                    >
                      {t("errors.noProductsFoundTitle")}
                    </Text>
                  </View>
                  <Paragraph
                    style={{
                      color: theme.colors.onErrorContainer,
                      marginLeft: 8,
                    }}
                  >
                    {error}
                  </Paragraph>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 12,
                      marginLeft: 8,
                    }}
                  >
                    <Button
                      mode="outlined"
                      onPress={() => {
                        setError("");
                        setSearchValue("");
                        setResults(null);
                      }}
                      style={{ marginRight: 8 }}
                      textColor={theme.colors.error}
                    >
                      {t("common.retry")}
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ) : null}
          </Card.Content>
        </Card>
        {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
        {results && results.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                <IconButton
                  icon="format-list-bulleted"
                  size={20}
                  iconColor={theme.colors.primary}
                />
                Resultados ({results.length})
              </Text>
              {results.map((prod) => (
                <TouchableOpacity
                  key={prod.codigo}
                  onPress={() => setSelected(prod)}
                  style={styles.resultItem}
                >
                  <Surface style={styles.resultCard} elevation={0}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultTitle} numberOfLines={2}>
                        {prod.nombre}
                      </Text>
                      <IconButton
                        icon="chevron-right"
                        size={20}
                        iconColor={theme.colors.primary}
                      />
                    </View>
                    <View style={styles.resultDetails}>
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultLabel}>Código:</Text>
                        <Text style={styles.resultValue}>{prod.codigo}</Text>
                      </View>
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultLabel}>Código de Barra:</Text>
                        <Text style={styles.resultValue}>
                          {prod.codigoBarra}
                        </Text>
                      </View>
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultLabel}>Precio:</Text>
                        <Text style={[styles.resultValue, styles.resultPrice]}>
                          ${prod.precio1.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultLabel}>Área:</Text>
                        <Text style={styles.resultValue}>{prod.area}</Text>
                      </View>
                    </View>
                    {/* Stock summary */}
                    <View style={styles.stockSummary}>
                      <Chip
                        icon="package-variant"
                        compact
                        style={styles.stockSummaryChip}
                      >
                        {prod.existencias.reduce(
                          (total, ex) => total + ex.existencia,
                          0
                        )}{" "}
                        unidades
                      </Chip>
                      <Chip
                        icon={
                          prod.status === "A" ? "check-circle" : "alert-circle"
                        }
                        compact
                        style={[
                          styles.statusSummaryChip,
                          {
                            backgroundColor:
                              prod.status === "A"
                                ? theme.colors.primaryContainer
                                : theme.colors.errorContainer,
                          },
                        ]}
                      >
                        {prod.status === "A" ? "Activo" : "Inactivo"}
                      </Chip>
                    </View>
                  </Surface>
                </TouchableOpacity>
              ))}
            </Card.Content>
          </Card>
        )}
        {results && results.length === 0 && !loading && !error && (
          <Card
            style={[
              styles.card,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Card.Content style={{ alignItems: "center", paddingVertical: 32 }}>
              <IconButton
                icon="package-variant-off"
                size={48}
                iconColor={theme.colors.onSurfaceVariant}
                style={{ margin: 0, marginBottom: 8 }}
              />
              <Text
                variant="titleMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  marginBottom: 8,
                }}
              >
                {t("errors.noProductsFoundTitle")}
              </Text>
              <Paragraph
                style={{
                  color: theme.colors.onSurfaceVariant,
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {t("errors.noProductsFoundMessage")}
              </Paragraph>
              <Button
                mode="outlined"
                onPress={() => {
                  setSearchValue("");
                  setResults(null);
                }}
                icon="magnify"
              >
                {t("common.search")}
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 8, // Reduced top padding since SafeAreaView handles safe area
    paddingBottom: 0, // Remove bottom padding to eliminate gap above tab bar
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  productNameCard: {
    backgroundColor: "#f8f9fa",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
    fontStyle: "italic",
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusChip: {
    marginRight: 8,
    marginBottom: 4,
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
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  mainPrice: {
    fontSize: 20,
    color: "#2e7d32",
  },
  costPrice: {
    color: "#d32f2f",
  },
  priceDivider: {
    marginVertical: 8,
  },
  stockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  stockInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  lastUpdated: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  stockChip: {
    marginLeft: 12,
  },
  actionButton: {
    marginBottom: 12,
  },
  // Search results styles
  resultItem: {
    marginBottom: 8,
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  resultDetails: {
    marginBottom: 12,
  },
  resultInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  resultValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  resultPrice: {
    color: "#2e7d32",
    fontSize: 16,
  },
  stockSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  stockSummaryChip: {
    backgroundColor: "#e3f2fd",
  },
  statusSummaryChip: {
    marginLeft: 8,
  },
});

export default ProductScreen;
