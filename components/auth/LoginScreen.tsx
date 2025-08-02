import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  Paragraph,
  Snackbar,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import { auth } from "../../config/firebase";
import { CustomTheme } from "../../constants/Theme";
import { useTranslation } from "../../hooks/useTranslation";

interface LoginScreenProps {
  onNavigateToSignUp?: () => void;
  onNavigateToPasswordReset?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToSignUp,
  onNavigateToPasswordReset,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme() as CustomTheme;
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError(t("auth.invalidCredentials"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/invalid-email":
        return t("auth.invalidCredentials");
      case "auth/user-disabled":
        return t("errors.authorizationError");
      case "auth/user-not-found":
        return t("auth.invalidCredentials");
      case "auth/wrong-password":
        return t("auth.invalidCredentials");
      case "auth/too-many-requests":
        return t("errors.timeoutError");
      default:
        return t("errors.authenticationError");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Title style={[styles.title, { color: theme.colors.primary }]}>
                {t("messages.welcome")}
              </Title>
              <Paragraph
                style={[styles.subtitle, { color: theme.colors.onSurface }]}
              >
                {t("auth.signIn")}
              </Paragraph>

              <TextInput
                label={t("common.email")}
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                disabled={loading}
              />

              <TextInput
                label={t("common.password")}
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                style={styles.input}
                disabled={loading}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {t("auth.signIn")}
              </Button>

              {onNavigateToPasswordReset && (
                <Button
                  mode="text"
                  onPress={onNavigateToPasswordReset}
                  disabled={loading}
                  style={styles.textButton}
                >
                  {t("auth.forgotPassword")}
                </Button>
              )}

              {onNavigateToSignUp && (
                <Button
                  mode="text"
                  onPress={onNavigateToSignUp}
                  disabled={loading}
                  style={styles.textButton}
                >
                  {t("auth.dontHaveAccount")}
                </Button>
              )}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError("")}
        duration={4000}
        action={{
          label: t("common.cancel"),
          onPress: () => setError(""),
        }}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  textButton: {
    marginTop: 8,
  },
});

export default LoginScreen;
