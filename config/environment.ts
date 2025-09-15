/**
 * Environment configuration utility
 * Handles local development vs production API configuration
 */

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

// Log current environment configuration
export const logEnvironmentConfig = () => {
  const config = getEnvironmentConfig();
  console.log("📱 Environment Configuration:", {
    mode: config.mode,
    isLocalDevelopment: config.isLocalDevelopment,
    apiBaseURL: config.apiBaseURL || "Using header-based routing",
    nodeEnv: process.env.NODE_ENV,
    localMode: process.env.EXPO_PUBLIC_LOCAL_MODE,
    useLocalAPI: process.env.EXPO_PUBLIC_USE_LOCAL_API,
  });
};
