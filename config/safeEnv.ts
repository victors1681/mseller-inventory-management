/**
 * Safe environment variable loader
 * Prevents crashes from missing environment variables in production
 */

// Safe getter for environment variables
export const getEnvVar = (key: string, defaultValue: string = ""): string => {
  try {
    // Use type assertion to access dynamic keys safely
    const env = process.env as Record<string, string | undefined>;
    return env[key] || defaultValue;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return defaultValue;
  }
};

// Safe getter for boolean environment variables
export const getEnvBool = (
  key: string,
  defaultValue: boolean = false
): boolean => {
  try {
    const env = process.env as Record<string, string | undefined>;
    const value = env[key];
    if (value === undefined || value === null) return defaultValue;
    return value.toLowerCase() === "true";
  } catch (error) {
    console.warn(
      `Failed to access boolean environment variable ${key}:`,
      error
    );
    return defaultValue;
  }
};

// Validate required environment variables
export const validateRequiredEnvVars = (requiredVars: string[]): boolean => {
  const missing: string[] = [];

  requiredVars.forEach((varName) => {
    if (!getEnvVar(varName)) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.warn("Missing required environment variables:", missing);
    return false;
  }

  return true;
};

// Get app configuration safely
export const getAppConfig = () => {
  return {
    // Firebase config
    firebaseApiKey: getEnvVar("EXPO_PUBLIC_FIREBASE_API_KEY"),
    firebaseAuthDomain: getEnvVar("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    firebaseProjectId: getEnvVar("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
    firebaseStorageBucket: getEnvVar("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    firebaseMessagingSenderId: getEnvVar(
      "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    ),
    firebaseAppId: getEnvVar("EXPO_PUBLIC_FIREBASE_APP_ID"),

    // Datadog config
    datadogClientToken: getEnvVar("EXPO_PUBLIC_DATADOG_CLIENT_TOKEN"),
    datadogApplicationId: getEnvVar("EXPO_PUBLIC_DATADOG_APPLICATION_ID"),

    // Local development
    localMode: getEnvBool("EXPO_PUBLIC_LOCAL_MODE"),
    useLocalApi: getEnvBool("EXPO_PUBLIC_USE_LOCAL_API"),
  };
};

export default {
  getEnvVar,
  getEnvBool,
  validateRequiredEnvVars,
  getAppConfig,
};
