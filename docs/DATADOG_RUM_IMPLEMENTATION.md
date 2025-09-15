# Datadog RUM Implementation Guide

This document describes the Datadog Real User Monitoring (RUM) implementation for the MSeller Lite application.

## Overview

The Datadog RUM integration provides comprehensive monitoring and analytics for the React Native application, including:

- **Screen Tracking**: Automatic tracking of screen views and navigation
- **API Monitoring**: Real-time tracking of API calls, response times, and errors
- **Error Tracking**: Automatic capture and reporting of application errors
- **User Interactions**: Tracking of button clicks, form submissions, and other user actions
- **Performance Monitoring**: Monitoring of app performance and user experience

## Setup Instructions

### 1. Datadog Account Setup

1. Create a Datadog account at [app.datadoghq.com](https://app.datadoghq.com)
2. Navigate to **RUM** → **Applications**
3. Click **Create Application**
4. Select **React Native** as the application type
5. Configure your application name and environment
6. Copy the **Client Token** and **Application ID**

### 2. Environment Configuration

1. Copy `.env.example` to `.env`
2. Add your Datadog credentials:

```bash
EXPO_PUBLIC_DATADOG_CLIENT_TOKEN=your_datadog_client_token_here
EXPO_PUBLIC_DATADOG_APPLICATION_ID=your_datadog_application_id_here
```

### 3. Installation

The required packages are already installed:

```bash
npm install @datadog/mobile-react-native @datadog/mobile-react-navigation
```

## Implementation Details

### Core Components

#### 1. Datadog Configuration (`/config/datadog.ts`)

- **Purpose**: Central configuration and initialization
- **Features**:
  - Environment-based configuration (local vs production)
  - Automatic initialization on app start
  - Logging-based tracking for simplified implementation
  - Error handling and fallback logging

#### 2. Screen Tracking Service (`/services/screenTracker.ts`)

- **Purpose**: Track screen views and user interactions
- **Features**:
  - Automatic screen view tracking
  - Manual interaction tracking
  - Time-spent-on-screen calculation
  - Navigation event tracking

#### 3. Higher-Order Components (`/components/common/ScreenTracking.tsx`)

- **Purpose**: Reusable tracking components and hooks
- **Features**:
  - `withScreenTracking()` HOC for automatic screen tracking
  - `useManualScreenTracking()` hook for custom tracking
  - Tracked button components

### Screen Tracking Implementation

Each screen is automatically tracked using the `useScreenTracking` hook:

```tsx
import { useScreenTracking } from "@/services/screenTracker";

export default function MyScreen() {
  // Automatic screen tracking
  useScreenTracking('my_screen', {
    user_id: user?.uid,
    additional_context: 'value'
  });

  return (
    // Screen content
  );
}
```

### API Tracking Implementation

API calls are automatically tracked through interceptors in `/services/api.ts`:

- **Request Tracking**: Start time, authentication status
- **Response Tracking**: Duration, status codes, response sizes
- **Error Tracking**: Failed requests, network errors, token refresh failures

### Manual Event Tracking

For custom events, use the manual tracking functions:

```tsx
import { useManualScreenTracking } from "@/components/common/ScreenTracking";

const { trackButtonClick, trackFormSubmission } = useManualScreenTracking();

// Track button clicks
trackButtonClick("screen_name", "button_name", { additional: "data" });

// Track form submissions
trackFormSubmission("screen_name", "form_name", true, { form_data: "info" });
```

## Tracked Screens

The following screens are currently tracked:

### Main Application Screens

- **Home Screen** (`home_screen`)

  - User authentication status
  - Profile completion status
  - Loading states

- **Inventory Tab** (`inventory_tab`)

  - Current sub-screen navigation
  - Inventory count operations
  - Navigation between inventory states

- **API Test Tab** (`api_test_tab`)

  - Testing screen interactions
  - API testing operations

- **Profile Tab** (`profile_tab`)
  - User profile data status
  - Profile modification events

### Authentication Screens

- **Login Screen** (`login_screen`)

  - Authentication attempts
  - Form validation errors
  - Login success/failure rates

- **App Launch** (`app_launch`)
  - Initial app startup
  - Theme and configuration detection

## Data Collected

### Screen Events

- Screen name and view time
- User ID and session information
- Navigation patterns
- Screen-specific context data

### API Events

- Request URL and method
- Response status codes
- Request duration
- Error messages and types
- Environment context (local vs production)

### Error Events

- Error messages and stack traces
- Screen context where errors occur
- User actions leading to errors
- Authentication and API-related errors

### User Interaction Events

- Button clicks and element interactions
- Form submissions and validation results
- Search queries and results
- Navigation actions

## Environment Modes

The implementation supports different tracking levels based on environment:

### Local Development

- **Sample Rate**: 100% (all events tracked)
- **Verbosity**: Debug level logging
- **Features**: Full console logging for debugging

### Production

- **Sample Rate**: 20% (reduced for performance)
- **Verbosity**: Warning level only
- **Features**: Optimized for performance

## Monitoring and Analytics

### Key Metrics Available in Datadog

1. **User Experience**

   - Screen load times
   - Navigation flow analysis
   - Error rates by screen

2. **API Performance**

   - Request/response times
   - Error rates by endpoint
   - Authentication success rates

3. **Error Analysis**

   - Crash reports and stack traces
   - Error frequency and patterns
   - User impact assessment

4. **User Behavior**
   - Screen usage patterns
   - Feature adoption rates
   - User journey analysis

## Best Practices

### For Developers

1. **Always track screens**: Add `useScreenTracking` to new screens
2. **Track important interactions**: Use manual tracking for critical user actions
3. **Include context**: Add relevant metadata to tracking calls
4. **Handle errors gracefully**: Ensure tracking doesn't break app functionality

### For Data Analysis

1. **Monitor error rates**: Set up alerts for high error rates
2. **Track performance trends**: Monitor API response times and screen load times
3. **Analyze user flows**: Use session replay and user journey analysis
4. **Segment by environment**: Separate local development from production data

## Troubleshooting

### Common Issues

1. **No data in Datadog**

   - Verify environment variables are set correctly
   - Check initialization logs in console
   - Ensure network connectivity

2. **Missing screen events**

   - Verify `useScreenTracking` is called in screen components
   - Check console for tracking logs
   - Ensure screen names are consistent

3. **API tracking not working**
   - Verify API interceptors are properly configured
   - Check for authentication errors
   - Monitor console for API tracking logs

### Debug Mode

Enable debug logging by setting `EXPO_PUBLIC_LOCAL_MODE=true` to see detailed tracking information in the console.

## Future Enhancements

Potential improvements for the Datadog implementation:

1. **Enhanced User Tracking**: User properties and segments
2. **Custom Dashboards**: Pre-built dashboards for key metrics
3. **Alert Configuration**: Automated alerts for critical issues
4. **Session Replay**: Visual user session recordings
5. **A/B Testing Integration**: Experiment tracking and analysis

## Support

For questions or issues with the Datadog implementation, consult:

1. [Datadog RUM Documentation](https://docs.datadoghq.com/real_user_monitoring/)
2. [React Native SDK Guide](https://docs.datadoghq.com/real_user_monitoring/reactnative/)
3. This project's implementation in `/config/datadog.ts` and `/services/screenTracker.ts`
