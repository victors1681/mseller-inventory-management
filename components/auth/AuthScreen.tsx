import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { CustomTheme } from "../../constants/Theme";
import LoginScreen from "./LoginScreen";
import PasswordResetScreen from "./PasswordResetScreen";
import SignUpScreen from "./SignUpScreen";

type AuthMode = "login" | "signup" | "reset";

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const theme = useTheme() as CustomTheme;

  const renderScreen = () => {
    switch (mode) {
      case "login":
        return (
          <LoginScreen
            onNavigateToSignUp={() => setMode("signup")}
            onNavigateToPasswordReset={() => setMode("reset")}
          />
        );
      case "signup":
        return <SignUpScreen onNavigateToLogin={() => setMode("login")} />;
      case "reset":
        return <PasswordResetScreen onNavigateBack={() => setMode("login")} />;
      default:
        return (
          <LoginScreen
            onNavigateToSignUp={() => setMode("signup")}
            onNavigateToPasswordReset={() => setMode("reset")}
          />
        );
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AuthScreen;
