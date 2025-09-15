/**
 * Test file to demonstrate enhanced Datadog logging with app version and user info
 * This can be used for testing the logging functionality
 */

import { trackApiCall, trackError, trackEvent } from "../config/datadog";

// Example function to test enhanced logging
export const testDatadogLogging = () => {
  console.log("🧪 Testing Datadog logging with enhanced context...");

  // Test event tracking
  trackEvent("test_event", {
    feature: "enhanced_logging",
    test_type: "manual",
  });

  // Test error tracking
  try {
    throw new Error("Test error for Datadog logging");
  } catch (error) {
    trackError(error as Error, {
      context: "test_scenario",
      severity: "low",
    });
  }

  // Test API call tracking
  trackApiCall("https://api.example.com/test", "GET", 200, 150, {
    test_call: true,
    endpoint_type: "test",
  });

  console.log(
    "✅ Enhanced logging test completed - check console for detailed output"
  );
};

// Example of what the enhanced logs will contain:
// {
//   event_type: "custom_event",
//   timestamp: "2025-09-15T...",
//   app_version: "1.0.0",
//   app_name: "mseller-lite",
//   user_id: "firebase_user_uid_or_anonymous",
//   user_email: "user@example.com_or_unknown",
//   user_display_name: "User Name_or_unknown",
//   is_authenticated: true/false,
//   expo_version: "51.0.0",
//   platform: "ios" | "android",
//   // ... plus any custom attributes
// }
