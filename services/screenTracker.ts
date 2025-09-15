/**
 * Screen tracking service for Datadog RUM
 * Tracks navigation events and screen views
 */

import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { trackEvent } from "../config/datadog";

// Screen tracking utility
export class ScreenTracker {
  private static currentScreen: string | null = null;
  private static screenStartTime: number | null = null;

  // Track screen view manually
  static trackScreenView(screenName: string, attributes?: Record<string, any>) {
    // Track previous screen time if available
    if (this.currentScreen && this.screenStartTime) {
      const timeSpent = Date.now() - this.screenStartTime;
      trackEvent("screen_exit", {
        screen_name: this.currentScreen,
        time_spent_ms: timeSpent,
        next_screen: screenName,
      });
    }

    // Track new screen entry
    this.currentScreen = screenName;
    this.screenStartTime = Date.now();

    trackEvent("screen_view", {
      screen_name: screenName,
      timestamp: new Date().toISOString(),
      ...attributes,
    });

    console.log(`📊 Screen tracked: ${screenName}`, attributes);
  }

  // Track user interactions on screens
  static trackInteraction(
    interactionType: string,
    screenName: string,
    element?: string,
    attributes?: Record<string, any>
  ) {
    trackEvent("user_interaction", {
      interaction_type: interactionType,
      screen_name: screenName,
      element_name: element,
      timestamp: new Date().toISOString(),
      ...attributes,
    });
  }

  // Track screen errors
  static trackScreenError(
    screenName: string,
    error: Error,
    attributes?: Record<string, any>
  ) {
    trackEvent("screen_error", {
      screen_name: screenName,
      error_message: error.message,
      error_stack: error.stack,
      timestamp: new Date().toISOString(),
      ...attributes,
    });
  }

  // Track form submissions
  static trackFormSubmission(
    screenName: string,
    formName: string,
    success: boolean,
    attributes?: Record<string, any>
  ) {
    trackEvent("form_submission", {
      screen_name: screenName,
      form_name: formName,
      success,
      timestamp: new Date().toISOString(),
      ...attributes,
    });
  }

  // Track button clicks
  static trackButtonClick(
    screenName: string,
    buttonName: string,
    attributes?: Record<string, any>
  ) {
    this.trackInteraction("button_click", screenName, buttonName, attributes);
  }

  // Track search actions
  static trackSearch(
    screenName: string,
    searchQuery: string,
    resultsCount?: number,
    attributes?: Record<string, any>
  ) {
    trackEvent("search", {
      screen_name: screenName,
      search_query: searchQuery,
      results_count: resultsCount,
      timestamp: new Date().toISOString(),
      ...attributes,
    });
  }

  // Get current screen name
  static getCurrentScreen(): string | null {
    return this.currentScreen;
  }
}

// Navigation container wrapper with Datadog tracking
export const createTrackedNavigationContainer = (
  NavigationContainerComponent: typeof NavigationContainer
) => {
  // Use the navigation tracking from Datadog
  return NavigationContainerComponent; // Will be enhanced with navigation listener
};

// Hook for screen tracking in components
export const useScreenTracking = (
  screenName: string,
  attributes?: Record<string, any>
) => {
  React.useEffect(() => {
    ScreenTracker.trackScreenView(screenName, attributes);

    return () => {
      // Optional cleanup if needed
    };
  }, [screenName, attributes]);
};

export default ScreenTracker;
