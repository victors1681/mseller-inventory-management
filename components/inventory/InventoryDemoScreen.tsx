import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  IconButton,
  Paragraph,
  Title,
  useTheme,
} from "react-native-paper";
import { getEnvironmentConfig } from "../../config/environment";
import { CustomTheme } from "../../constants/Theme";
import { useUser } from "../../contexts/UserContext";
import { useTranslation } from "../../hooks/useTranslation";

interface InventoryDemoScreenProps {
  onNavigateBack?: () => void;
}

const InventoryDemoScreen: React.FC<InventoryDemoScreenProps> = ({
  onNavigateBack,
}) => {
  // Hooks must be called at the top level - always in the same order
  const userContext = useUser();
  const { t } = useTranslation();
  const theme = useTheme() as CustomTheme;
  const envConfig = getEnvironmentConfig();

  // Destructure userProfile safely
  const { userProfile } = userContext;

  const warehouseId = userProfile?.warehouse || "N/A";

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.headerInfo}>
                <View style={styles.headerTitleRow}>
                  <Title
                    style={{
                      color: theme.colors.primary,
                      marginBottom: 8,
                      flex: 1,
                    }}
                  >
                    🏗️ {t("inventory.inventoryCount")} {t("inventory.mobile")}
                  </Title>
                  <Chip
                    icon={envConfig.isLocalDevelopment ? "server" : "cloud"}
                    style={{
                      backgroundColor: envConfig.isLocalDevelopment
                        ? "#4CAF50"
                        : "#2196F3",
                      marginLeft: 8,
                    }}
                    textStyle={{ color: "white", fontSize: 12 }}
                    compact
                  >
                    {envConfig.mode.toUpperCase()}
                  </Chip>
                </View>
                {envConfig.isLocalDevelopment && (
                  <Paragraph style={styles.localModeInfo}>
                    🚧 Modo Local: {envConfig.apiBaseURL}
                  </Paragraph>
                )}
              </View>
              {onNavigateBack && (
                <IconButton
                  icon="arrow-left"
                  size={24}
                  onPress={onNavigateBack}
                  iconColor={theme.colors.primary}
                />
              )}
            </View>
            <Paragraph>
              Esta pantalla mostraría la funcionalidad completa del sistema de
              inventario móvil una vez que esté conectado a la API del servidor.
            </Paragraph>
            <Paragraph style={styles.warehouseInfo}>
              <Text style={{ fontWeight: "bold" }}>
                {t("inventory.warehouse")}:
              </Text>{" "}
              {warehouseId}
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Features Overview */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={{ color: theme.colors.primary, marginBottom: 16 }}>
              ✨ Características Implementadas
            </Title>

            <View style={styles.featureItem}>
              <Paragraph style={styles.featureTitle}>
                📱 Interfaz Móvil Optimizada
              </Paragraph>
              <Paragraph style={styles.featureDescription}>
                UI responsiva con React Native Paper, soporte para modo
                oscuro/claro
              </Paragraph>
            </View>

            <View style={styles.featureItem}>
              <Paragraph style={styles.featureTitle}>
                🔐 Autenticación Integrada
              </Paragraph>
              <Paragraph style={styles.featureDescription}>
                Firebase Auth con configuración automática de URLs de API basada
                en el perfil del usuario
              </Paragraph>
            </View>

            <View style={styles.featureItem}>
              <Paragraph style={styles.featureTitle}>
                📊 Sistema de Conteo Completo
              </Paragraph>
              <Paragraph style={styles.featureDescription}>
                Pantallas para conteo de productos, progreso en tiempo real, y
                manejo de discrepancias
              </Paragraph>
            </View>

            <View style={styles.featureItem}>
              <Paragraph style={styles.featureTitle}>
                📁 Operaciones Offline
              </Paragraph>
              <Paragraph style={styles.featureDescription}>
                Cola de sincronización automática con AsyncStorage para
                funcionamiento sin conexión
              </Paragraph>
            </View>

            <View style={styles.featureItem}>
              <Paragraph style={styles.featureTitle}>
                🌐 Soporte Multiidioma
              </Paragraph>
              <Paragraph style={styles.featureDescription}>
                Inglés y Español incluidos, con detección automática del idioma
                del dispositivo
              </Paragraph>
            </View>

            <View style={styles.featureItem}>
              <Paragraph style={styles.featureTitle}>
                🔌 APIs Implementadas
              </Paragraph>
              <Paragraph style={styles.featureDescription}>
                Servicio completo para integración con Consumo.Api del sistema
                MSeller
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* API Endpoints */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={{ color: theme.colors.primary, marginBottom: 16 }}>
              🔗 Endpoints de API Listos
            </Title>

            <View style={styles.apiSection}>
              <Paragraph style={styles.apiTitle}>
                Operaciones Básicas:
              </Paragraph>
              <Paragraph style={styles.apiItem}>
                • GET /consumo/inventariomovil/conteos-activos/{`{localidadId}`}
              </Paragraph>
              <Paragraph style={styles.apiItem}>
                • GET /consumo/inventariomovil/conteo/{`{conteoId}`}/productos
              </Paragraph>
              <Paragraph style={styles.apiItem}>
                • POST /consumo/inventariomovil/contar-producto
              </Paragraph>
            </View>

            <View style={styles.apiSection}>
              <Paragraph style={styles.apiTitle}>Código de Barras:</Paragraph>
              <Paragraph style={styles.apiItem}>
                • GET /consumo/inventariomovil/validar-codigo-barra
              </Paragraph>
              <Paragraph style={styles.apiItem}>
                • POST /consumo/inventariomovil/contar-por-codigo-barra
              </Paragraph>
            </View>

            <View style={styles.apiSection}>
              <Paragraph style={styles.apiTitle}>
                Conteo Sistemático por Zonas:
              </Paragraph>
              <Paragraph style={styles.apiItem}>
                • GET /api/inventariozonas/mi-zona/{`{conteoId}`}
              </Paragraph>
              <Paragraph style={styles.apiItem}>
                • GET /api/inventariozonas/siguiente-producto-zona
              </Paragraph>
              <Paragraph style={styles.apiItem}>
                • POST /api/inventariozonas/contar-producto-zona
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Next Steps */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={{ color: theme.colors.secondary, marginBottom: 16 }}>
              🚀 Próximos Pasos
            </Title>

            <Paragraph style={styles.stepItem}>
              1.{" "}
              <Text style={{ fontWeight: "bold" }}>Conectar API Backend:</Text>{" "}
              Configurar URLs del servidor en Firebase Functions
            </Paragraph>
            <Paragraph style={styles.stepItem}>
              2.{" "}
              <Text style={{ fontWeight: "bold" }}>
                Pruebas de Integración:
              </Text>{" "}
              Verificar endpoints con datos reales
            </Paragraph>
            <Paragraph style={styles.stepItem}>
              3. <Text style={{ fontWeight: "bold" }}>Manejo de Errores:</Text>{" "}
              Implementar reintentos y fallbacks específicos
            </Paragraph>
            <Paragraph style={styles.stepItem}>
              4. <Text style={{ fontWeight: "bold" }}>Scanner de Códigos:</Text>{" "}
              Integrar biblioteca de camera para escaneo
            </Paragraph>
            <Paragraph style={styles.stepItem}>
              5.{" "}
              <Text style={{ fontWeight: "bold" }}>Notificaciones Push:</Text>{" "}
              Alertas para conteos asignados
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Local Development Setup */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={{ color: theme.colors.tertiary, marginBottom: 16 }}>
              🛠️ Configuración de Desarrollo Local
            </Title>

            <View style={styles.archItem}>
              <Paragraph style={styles.archTitle}>
                Para usar con servidor local:
              </Paragraph>
              <Paragraph style={styles.codeBlock}>
                npm run start:local{"\n"}
                npm run android:local{"\n"}
                npm run ios:local{"\n"}
                npm run web:local
              </Paragraph>
            </View>

            <View style={styles.archItem}>
              <Paragraph style={styles.archTitle}>
                Servidor de Desarrollo:
              </Paragraph>
              <Paragraph style={styles.archDescription}>
                • El servidor local debe estar ejecutándose en
                https://localhost:7174{"\n"}• El modo local bypasa la
                configuración de usuario{"\n"}• Todas las requests van
                directamente al localhost
              </Paragraph>
            </View>

            <View style={styles.archItem}>
              <Paragraph style={styles.archTitle}>Modo Actual:</Paragraph>
              <Paragraph
                style={[
                  styles.archDescription,
                  {
                    backgroundColor: envConfig.isLocalDevelopment
                      ? "#E8F5E8"
                      : "#E3F2FD",
                    color: envConfig.isLocalDevelopment ? "#2E7D32" : "#1565C0",
                  },
                ]}
              >
                {envConfig.isLocalDevelopment
                  ? `🚧 LOCAL - ${envConfig.apiBaseURL}`
                  : "☁️ PRODUCTION - Header-based routing"}
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Technical Architecture */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={{ color: theme.colors.tertiary, marginBottom: 16 }}>
              🏗️ Arquitectura Técnica
            </Title>

            <View style={styles.archItem}>
              <Paragraph style={styles.archTitle}>Servicios:</Paragraph>
              <Paragraph style={styles.archDescription}>
                • InventoryMobileService - API principal{"\n"}•
                InventoryOfflineManager - Sincronización offline{"\n"}•
                AsyncStorage - Persistencia local
              </Paragraph>
            </View>

            <View style={styles.archItem}>
              <Paragraph style={styles.archTitle}>Componentes UI:</Paragraph>
              <Paragraph style={styles.archDescription}>
                • InventoryMainScreen - Dashboard principal{"\n"}•
                ProductCountingScreen - Captura de conteos{"\n"}•
                InventoryProgressScreen - Seguimiento de progreso
              </Paragraph>
            </View>

            <View style={styles.archItem}>
              <Paragraph style={styles.archTitle}>Tipos de Datos:</Paragraph>
              <Paragraph style={styles.archDescription}>
                • TypeScript completo con interfaces para todas las operaciones
                {"\n"}• Enums para estados y tipos de operación{"\n"}•
                Validación automática de tipos en tiempo de compilación
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Button
            mode="contained"
            icon="api"
            onPress={() => {
              // Navigate to API test screen
            }}
            style={styles.footerButton}
          >
            Probar Configuración de API
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  localModeInfo: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: 4,
  },
  warehouseInfo: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  featureItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  featureTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  apiSection: {
    marginBottom: 16,
  },
  apiTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  apiItem: {
    fontSize: 12,
    fontFamily: "monospace",
    backgroundColor: "#F5F5F5",
    padding: 4,
    marginBottom: 4,
    borderRadius: 4,
  },
  stepItem: {
    marginBottom: 12,
    fontSize: 14,
  },
  archItem: {
    marginBottom: 16,
  },
  archTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  archDescription: {
    fontSize: 14,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    fontFamily: "monospace",
  },
  codeBlock: {
    fontSize: 14,
    backgroundColor: "#2D2D2D",
    color: "#F8F8F2",
    padding: 12,
    borderRadius: 8,
    fontFamily: "monospace",
  },
  footer: {
    marginTop: 16,
    marginBottom: 32,
  },
  footerButton: {
    borderRadius: 8,
  },
});

export default InventoryDemoScreen;
