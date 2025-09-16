/**
 * Environment configuration utility
 * Handles local development vs production API configuration
 */

import { IConfig } from "../types/user";

export interface EnvironmentConfig {
  isLocalDevelopment: boolean;
  apiBaseURL?: string;
  mode: "local" | "production";
}

// Check if we're running in local development mode
const checkLocalDevelopment = (): boolean => {
  // For React Native/Expo, we can check environment variables
  // The --local flag would be passed as an environment variable
  return (
    process.env.EXPO_PUBLIC_LOCAL_MODE === "true" ||
    (process.env.NODE_ENV === "development" &&
      process.env.EXPO_PUBLIC_USE_LOCAL_API === "true")
  );
};

// Get environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const isLocalDevelopment = checkLocalDevelopment();

  return {
    isLocalDevelopment,
    apiBaseURL: isLocalDevelopment ? "http://192.168.1.188:7173" : undefined,
    mode: isLocalDevelopment ? "local" : "production",
  };
};

// Get environment configuration with user business config
export const getEnvironmentConfigWithUser = (
  userConfig?: IConfig
): EnvironmentConfig => {
  const isLocalDevelopment = checkLocalDevelopment();

  if (isLocalDevelopment) {
    return {
      isLocalDevelopment: true,
      apiBaseURL: "http://192.168.1.188:7173",
      mode: "local",
    };
  }

  // In production mode, use user's business config if available
  const apiBaseURL =
    userConfig?.serverUrl && userConfig?.serverPort
      ? `${userConfig.serverUrl}:${userConfig.serverPort}`
      : undefined;

  return {
    isLocalDevelopment: false,
    apiBaseURL,
    mode: "production",
  };
};

// Log current environment configuration
export const logEnvironmentConfig = (userConfig?: IConfig) => {
  const config = userConfig
    ? getEnvironmentConfigWithUser(userConfig)
    : getEnvironmentConfig();
  console.log("📱 Environment Configuration:", {
    mode: config.mode,
    isLocalDevelopment: config.isLocalDevelopment,
    apiBaseURL: config.apiBaseURL || "No baseURL set",
    nodeEnv: process.env.NODE_ENV,
    localMode: process.env.EXPO_PUBLIC_LOCAL_MODE,
    useLocalAPI: process.env.EXPO_PUBLIC_USE_LOCAL_API,
  });
};
