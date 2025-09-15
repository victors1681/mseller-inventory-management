/**
 * Higher-order component for automatic screen tracking
 */

import React from "react";
import { ScreenTracker, useScreenTracking } from "../../services/screenTracker";

interface WithScreenTrackingProps {
  screenName?: string;
  trackingAttributes?: Record<string, any>;
}

export function withScreenTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultScreenName?: string
) {
  const WithScreenTrackingComponent = (props: P & WithScreenTrackingProps) => {
    const {
      screenName = defaultScreenName,
      trackingAttributes,
      ...rest
    } = props;

    // Always call the hook, but conditionally track
    const finalScreenName = screenName || "";
    useScreenTracking(finalScreenName, trackingAttributes);

    return <WrappedComponent {...(rest as P)} />;
  };

  WithScreenTrackingComponent.displayName = `withScreenTracking(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithScreenTrackingComponent;
}

// Hook for manual screen tracking
export const useManualScreenTracking = () => {
  return {
    trackScreenView: ScreenTracker.trackScreenView,
    trackInteraction: ScreenTracker.trackInteraction,
    trackButtonClick: ScreenTracker.trackButtonClick,
    trackFormSubmission: ScreenTracker.trackFormSubmission,
    trackSearch: ScreenTracker.trackSearch,
    trackScreenError: ScreenTracker.trackScreenError,
    getCurrentScreen: ScreenTracker.getCurrentScreen,
  };
};

// Component for tracking interactions
interface TrackedButtonProps {
  onPress: () => void;
  title: string;
  screenName?: string;
  buttonName?: string;
  attributes?: Record<string, any>;
  children?: React.ReactNode;
}

export const TrackedButton: React.FC<TrackedButtonProps> = ({
  onPress,
  title,
  screenName,
  buttonName,
  attributes,
  children,
  ...props
}) => {
  const handlePress = () => {
    if (screenName && buttonName) {
      ScreenTracker.trackButtonClick(screenName, buttonName, attributes);
    }
    onPress();
  };

  return (
    <button {...props} onClick={handlePress}>
      {children || title}
    </button>
  );
};

export default withScreenTracking;
