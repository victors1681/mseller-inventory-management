# API Integration with Firebase Authentication

## Overview

This implementation provides a complete API integration system with Firebase Authentication, including:

- **Axios HTTP client** with automatic token management
- **Firebase Functions integration** for user profile management
- **Automatic token refresh** and request retry logic
- **Business configuration** based URL routing
- **User context management** for application-wide state

## Architecture

### Services Layer

#### 1. API Service (`services/api.ts`)

- **Axios client** with automatic authorization headers
- **Request interceptor** - Adds Firebase Auth token to all requests
- **Response interceptor** - Handles 401 errors with token refresh
- **URL configuration** - Sets base URL based on user's business config

#### 2. User Service (`services/userService.ts`)

- **Firebase Functions integration** - Calls cloud functions for user data
- **Profile management** - Fetches and updates user profiles
- **Session initialization** - Sets up user session after login

### Context Layer

#### 1. AuthContext (`contexts/AuthContext.tsx`)

- **Firebase Auth state management**
- **User authentication status**
- **Loading states**

#### 2. UserContext (`contexts/UserContext.tsx`)

- **User profile management**
- **Business information**
- **Profile refresh functionality**

## Key Features

### Automatic Token Management

The axios client automatically:

- Adds Firebase Auth tokens to all requests
- Refreshes expired tokens
- Retries failed requests with new tokens

```typescript
// Automatic token handling
restClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Business Configuration URL Routing

Based on user's business config and test mode:

```typescript
export const axiosSetClientUrl = (config?: IConfig, userTestMode?: boolean) => {
  if (config?.serverUrl) {
    if (config.testMode || userTestMode) {
      // Use sandbox environment
      restClient.defaults.headers.common[
        "X-URL"
      ] = `${config.portalSandboxUrl}:${config.portalSandboxPort}`;
    } else {
      // Use production environment
      restClient.defaults.headers.common[
        "X-URL"
      ] = `${config.portalServerUrl}:${config.portalServerPort}`;
    }
  }
};
```

### Firebase Functions Integration

```typescript
// Get user profile from Firebase Function
export const getAllCurrentProfile = async (): Promise<
  UserTypes | undefined
> => {
  const fn = httpsCallable(functions, "getUserProfileV2");
  const profileDataResponse = await fn();
  const userData = profileDataResponse.data as UserTypes;

  // Automatically configure API client
  axiosSetClientUrl(userData.business.config, userData.testMode);

  return userData;
};
```

## Usage Examples

### 1. Using the User Context

```typescript
import { useUser } from "@/contexts/UserContext";

function MyComponent() {
  const { user, userProfile, loading, refreshUserProfile } = useUser();

  if (loading) return <LoadingScreen />;

  return (
    <View>
      <Text>Welcome, {userProfile?.firstName}!</Text>
      <Text>Company: {userProfile?.business.name}</Text>
      <Text>Mode: {userProfile?.testMode ? "Test" : "Production"}</Text>

      <Button onPress={refreshUserProfile}>Refresh Profile</Button>
    </View>
  );
}
```

### 2. Making API Calls

```typescript
import { restClient } from "@/services/api";

// The client is automatically configured with:
// - Authorization headers
// - Base URL based on user config
// - Retry logic for token refresh

const fetchInventory = async () => {
  try {
    const response = await restClient.get("/api/inventory");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    throw error;
  }
};
```

### 3. Refreshing User Data

```typescript
import {
  refreshUserAccessToken,
  getAllCurrentProfile,
} from "@/services/userService";

// Refresh just the token
const newToken = await refreshUserAccessToken();

// Refresh full profile (also updates API client config)
const profile = await getAllCurrentProfile();
```

## User Types

The system includes comprehensive TypeScript types:

### UserTypes Interface

```typescript
interface UserTypes {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  business: IBusiness;
  type:
    | "seller"
    | "administrator"
    | "superuser"
    | "driver"
    | "office"
    | "inventory"
    | "accounting"
    | "manager";
  testMode: boolean;
  sellerCode: string;
  cloudAccess: ICloudModules;
  // ... more fields
}
```

### Business Configuration

```typescript
interface IBusiness {
  businessId: string;
  name: string;
  config: IConfig;
  tier?: Tiers;
  // ... more fields
}

interface IConfig {
  // Server URLs
  serverUrl: string;
  serverPort: string;
  sandboxUrl: string;
  sandboxPort: string;

  // Portal URLs
  portalServerUrl: string;
  portalServerPort: string;
  portalSandboxUrl: string;
  portalSandboxPort: string;

  // Feature flags
  testMode: boolean;
  allowPriceBelowMinimum: boolean;
  allowOrderAboveCreditLimit: boolean;
  // ... more config options
}
```

## Testing

The app includes a dedicated **API Test** tab that allows you to:

1. **Test token refresh** - Manually refresh Firebase Auth tokens
2. **Test profile refresh** - Reload user profile and business config
3. **Test API calls** - Make sample API requests to verify configuration
4. **View API responses** - See actual response data and errors

## Error Handling

The system includes comprehensive error handling:

### Token Refresh Errors

- Automatic retry with new tokens
- Fallback to login screen if refresh fails
- Detailed error logging

### API Request Errors

- Structured error responses
- User-friendly error messages
- Automatic retry for network issues

### Profile Loading Errors

- Loading states during profile fetch
- Error messages in UI
- Retry functionality

## Security Considerations

1. **Token Security**

   - Tokens are never stored in local storage
   - Automatic token refresh prevents long-lived tokens
   - Tokens are only sent over HTTPS

2. **Environment Separation**

   - Clear separation between test and production environments
   - URL configuration based on user's business settings
   - Visual indicators for test mode

3. **Error Information**
   - Sensitive information is never exposed in error messages
   - Detailed logging only in development mode

## Deployment Considerations

### Environment Variables

Make sure to set up Firebase configuration in your `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

### Firebase Functions

Ensure your Firebase Functions are deployed and accessible:

- `getUserProfileV2` - Returns user profile with business info
- `getUserByAccessToken` - Gets user by access token
- `updateUserProfile` - Updates user profile data

### Business Configuration

Your backend should provide business configuration including:

- Server URLs for different environments
- Feature flags and permissions
- User-specific settings

## Troubleshooting

### Common Issues

1. **"Missing Firebase configuration" errors**

   - Check your `.env` file has all required values
   - Restart Expo development server

2. **Token refresh failures**

   - Verify Firebase Authentication is enabled
   - Check user permissions in Firebase Console

3. **API calls failing**

   - Verify business configuration URLs are correct
   - Check network connectivity
   - Review Firebase Function logs

4. **Profile loading issues**
   - Ensure Firebase Functions are deployed
   - Check function permissions and authentication

Use the **API Test** tab to diagnose and test these issues interactively.
