# Environment Variables Setup Guide

## Problem

Your app crashes in production builds because environment variables are not available. In development, variables are loaded from your local `.env` file, but in production builds, they need to be configured through Expo's environment management system.

## Solution: Set Environment Variables via Expo Dashboard

### Option 1: Using Expo Dashboard (Recommended)

1. **Go to Expo Dashboard**: <https://expo.dev/accounts/victors1681/projects/mseller-lite/environment-variables>

2. **Create environments** (if they don't exist):

   - `production`
   - `preview`
   - `development`

3. **Add the following environment variables for PRODUCTION environment**:

   **Firebase Configuration:**

   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY = [Your Firebase API Key]
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = [Your Firebase Auth Domain]
   EXPO_PUBLIC_FIREBASE_PROJECT_ID = [Your Firebase Project ID]
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = [Your Firebase Storage Bucket]
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [Your Firebase Messaging Sender ID]
   EXPO_PUBLIC_FIREBASE_APP_ID = [Your Firebase App ID]
   EXPO_PUBLIC_FIREBASE_DATABASE_URL = [Your Firebase Database URL]
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID = [Your Firebase Measurement ID]
   ```

   **Datadog Configuration:**

   ```env
   EXPO_PUBLIC_DATADOG_CLIENT_TOKEN = [Your Datadog Client Token]
   EXPO_PUBLIC_DATADOG_APPLICATION_ID = [Your Datadog Application ID]
   ```

4. **Set visibility**:

   - Firebase variables: `Plain text` (they're safe to be public)
   - Datadog variables: `Sensitive` (for better security)

5. **Repeat for PREVIEW environment** with the same values

### Option 2: Using EAS CLI (Alternative)

**⚠️ Security Warning**: Never commit scripts with actual credentials to git!

1. **Copy the template script**:

   ```bash
   cp scripts/setup-env-vars-template.sh scripts/setup-env-vars-local.sh
   ```

2. **Edit the local script** and replace all `YOUR_*_HERE` placeholders with your actual credentials

3. **Run the script**:

   ```bash
   ./scripts/setup-env-vars-local.sh
   ```

4. **Delete the script immediately after use**:

   ```bash
   rm scripts/setup-env-vars-local.sh
   ```

## Verification

After setting up environment variables:

1. **List environment variables**:

   ```bash
   eas env:list
   ```

2. **Test with a preview build**:

   ```bash
   eas build -p android --profile preview --clear-cache
   ```

3. **If preview works, try production**:

   ```bash
   eas build -p android --profile production --clear-cache
   ```

## Why This Fixes Your Crash

- **Development builds**: Use your local `.env` file
- **Production builds**: Use environment variables from Expo dashboard
- **Missing env vars**: Cause Firebase initialization to fail → app crashes

## Security Benefits

✅ No sensitive data in your repository  
✅ Different environments can have different configurations  
✅ Easy to rotate keys without code changes  
✅ Team members can't accidentally commit sensitive data

## Security Best Practices

### ✅ Safe to commit:

- Template scripts with placeholders
- Documentation
- Configuration files without credentials

### ❌ Never commit:

- Scripts with actual API keys
- `.env` files with real credentials
- Any file containing sensitive tokens

## Next Steps

1. Set up the environment variables in Expo dashboard
2. Remove any hardcoded values from your codebase
3. Test with a preview build first
4. Deploy production build
5. Add sensitive scripts to `.gitignore` if not already there
