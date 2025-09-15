/**
 * Datadog RUM configuration utility
 * Integrates with environment configuration for local vs production setup
 */

import {
  DdSdkReactNative,
  DdSdkReactNativeConfiguration,
} from "@datadog/mobile-react-native";
import Constants from "expo-constants";
import { getEnvironmentConfig } from "./environment";
import { auth } from "./firebase";

export interface DatadogConfig {
  clientToken: string;
  applicationId: string;
  environment: string;
  enabled: boolean;
}

// Get app and user context for logging
const getAppContext = () => {
  const currentUser = auth.currentUser;
  const appVersion = Constants.expoConfig?.version || "1.0.0";

  return {
    app_version: appVersion,
    app_name: Constants.expoConfig?.name || "mseller-lite",
    user_id: currentUser?.uid || "anonymous",
    user_email: currentUser?.email || "unknown",
    user_display_name: currentUser?.displayName || "unknown",
    is_authenticated: !!currentUser,
    expo_version: Constants.expoVersion,
    platform: Constants.platform?.ios ? "ios" : "android",
  };
};

// Function to log user authentication events with full context
export const trackUserAuth = (
  eventType: "login" | "logout" | "signup",
  additionalAttributes?: Record<string, any>
) => {
  const appContext = getAppContext();
  trackEvent(`user_${eventType}`, {
    ...appContext,
    auth_event_type: eventType,
    timestamp: new Date().toISOString(),
    ...additionalAttributes,
  });
};

// Get Datadog configuration based on environment
export const getDatadogConfig = (): DatadogConfig => {
  const envConfig = getEnvironmentConfig();

  return {
    clientToken: process.env.EXPO_PUBLIC_DATADOG_CLIENT_TOKEN || "",
    applicationId: process.env.EXPO_PUBLIC_DATADOG_APPLICATION_ID || "",
    environment: envConfig.mode,
    enabled: !!(
      process.env.EXPO_PUBLIC_DATADOG_CLIENT_TOKEN &&
      process.env.EXPO_PUBLIC_DATADOG_APPLICATION_ID
    ),
  };
};

// Initialize Datadog RUM
export const initializeDatadog = async (): Promise<boolean> => {
  const config = getDatadogConfig();

  if (!config.enabled) {
    console.log(
      "📊 Datadog RUM: Disabled - Missing client token or application ID"
    );
    return false;
  }

  try {
    const datadogConfig = new DdSdkReactNativeConfiguration(
      config.clientToken,
      config.environment,
      config.applicationId,
      true, // trackInteractions
      true, // trackResources
      true // trackErrors
    );

    // Configure based on environment
    datadogConfig.site = "US1"; // Change to your Datadog site (US1, EU1, etc.)

    // Additional configuration
    datadogConfig.nativeCrashReportEnabled = true;
    datadogConfig.sampleRate = config.environment === "local" ? 100 : 20; // 100% for local, 20% for production

    await DdSdkReactNative.initialize(datadogConfig);

    const appContext = getAppContext();
    console.log("📊 Datadog RUM: Initialized successfully", {
      environment: config.environment,
      applicationId: config.applicationId,
      sampleRate: datadogConfig.sampleRate,
      ...appContext,
    });

    return true;
  } catch (error) {
    console.error("📊 Datadog RUM: Initialization failed", error);
    return false;
  }
};

// Track custom events - simplified logging approach
export const trackEvent = (name: string, attributes?: Record<string, any>) => {
  const config = getDatadogConfig();
  const appContext = getAppContext();

  if (!config.enabled) {
    console.log(`📊 Event tracked (Datadog disabled): ${name}`, {
      ...appContext,
      ...attributes,
    });
    return;
  }

  // Log to console for now, will be automatically collected by Datadog
  console.log(`📊 RUM Event: ${name}`, {
    event_type: "custom_event",
    timestamp: new Date().toISOString(),
    ...appContext,
    ...attributes,
  });
};

// Track errors - simplified logging approach
export const trackError = (error: Error, attributes?: Record<string, any>) => {
  const config = getDatadogConfig();
  const appContext = getAppContext();

  if (!config.enabled) {
    console.log("📊 Error tracked (Datadog disabled):", error.message, {
      ...appContext,
      ...attributes,
    });
    return;
  }

  // Log error to console, will be automatically collected by Datadog
  console.error("📊 RUM Error:", {
    error_message: error.message,
    error_stack: error.stack,
    error_name: error.name,
    timestamp: new Date().toISOString(),
    ...appContext,
    ...attributes,
  });
};

// Track API calls - simplified logging approach
export const trackApiCall = (
  url: string,
  method: string,
  statusCode: number,
  duration: number,
  attributes?: Record<string, any>
) => {
  const config = getDatadogConfig();
  const appContext = getAppContext();

  if (!config.enabled) {
    console.log(
      `📊 API call tracked (Datadog disabled): ${method} ${url} - ${statusCode} (${duration}ms)`,
      {
        ...appContext,
        ...attributes,
      }
    );
    return;
  }

  // Log API call to console, will be automatically collected by Datadog
  console.log(`📊 RUM API Call: ${method} ${url}`, {
    event_type: "api_call",
    url,
    method,
    status_code: statusCode,
    duration_ms: duration,
    timestamp: new Date().toISOString(),
    ...appContext,
    ...attributes,
  });
};

export default {
  initialize: initializeDatadog,
  trackEvent,
  trackError,
  trackApiCall,
  trackUserAuth,
  getConfig: getDatadogConfig,
  getAppContext,
};
