# Environment Variables Setup for Firebase

## Overview

Your Firebase configuration is now set up to use environment variables instead of hardcoded values. This approach provides better security and flexibility for different deployment environments.

## Files Updated

### 1. Environment Files

- **`.env`** - Contains your actual Firebase configuration (not committed to git)
- **`.env.example`** - Template showing required environment variables
- **`app.config.js`** - Expo configuration that reads from environment variables

### 2. Configuration Files

- **`config/firebase.ts`** - Updated to read from environment variables
- **`utils/verifyFirebaseConfig.ts`** - Verification script to check configuration

## Environment Variables Used

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Getting Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ > Project settings
4. Scroll down to "Your apps" section
5. Select your web app or create one
6. Copy the configuration values from the Firebase SDK snippet

## Setup Steps

1. **Copy the template:**

   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual values:**

   - Replace all placeholder values with your Firebase project configuration
   - Never commit this file to version control

3. **Restart Expo development server:**
   ```bash
   npm start
   ```

## Security Benefits

✅ **Configuration is not hardcoded** - Values can be changed without code updates
✅ **Secrets are not in version control** - `.env` is gitignored
✅ **Different environments** - Can use different Firebase projects for dev/staging/prod
✅ **Team sharing** - Each developer can have their own `.env` file

## Troubleshooting

### Common Issues

1. **"Missing Firebase configuration" errors**

   - Check that your `.env` file exists
   - Verify all required variables are set
   - Restart the Expo development server

2. **Environment variables not loading**

   - Make sure you're using `EXPO_PUBLIC_` prefix
   - Check that `app.config.js` exists (not just `app.json`)
   - Clear Expo cache: `npx expo start --clear`

3. **Firebase initialization errors**
   - Verify your Firebase project is correctly configured
   - Check that Authentication is enabled in Firebase Console
   - Ensure all configuration values are correct

### Verification Script

Use the built-in verification script to check your configuration:

```typescript
import { verifyFirebaseConfig } from "./utils/verifyFirebaseConfig";

// Call this in your app to verify configuration
verifyFirebaseConfig();
```

The script will automatically run in development mode and show which configuration values are properly set.

## Different Environments

For different deployment environments, you can create additional environment files:

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

Expo will automatically load the appropriate file based on your environment.

## Next Steps

1. **Set up your Firebase project** if you haven't already
2. **Configure Authentication providers** in Firebase Console
3. **Update your `.env` file** with real configuration values
4. **Test the authentication flow** in your app

Remember: Never commit your `.env` file or share your Firebase configuration publicly!
