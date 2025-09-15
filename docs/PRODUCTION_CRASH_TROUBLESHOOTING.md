# Production App Crash Troubleshooting Guide

## 🚨 Common Causes of Production App Crashes

### 1. **Missing Environment Variables**

- Datadog credentials not properly configured
- Firebase configuration missing
- Solution: Verify `.env` file is properly configured

### 2. **Native Module Issues**

- Datadog React Native SDK not properly linked
- Firebase modules not configured
- Solution: Clean build and ensure proper installation

### 3. **Code Signing & Build Issues**

- Invalid certificates or provisioning profiles
- Bundle identifier mismatches
- Solution: Verify EAS build configuration

## ✅ **Fixes Applied**

### **1. Enhanced Error Handling**

- Added Error Boundary component to prevent total app crashes
- Wrapped Datadog initialization in try-catch blocks
- Added timeout protection for initialization

### **2. Safe Environment Loading**

- Created `safeEnv.ts` utility for robust environment variable access
- Added fallback values for all configuration
- Prevents crashes from missing environment variables

### **3. Improved Datadog Initialization**

- Added validation for client token and application ID
- Enhanced error handling with graceful fallbacks
- App continues to work even if Datadog fails to initialize

### **4. Production-Ready Firebase & Constants Access**

- Added fallback values for Constants access
- Protected Firebase auth access with try-catch blocks
- Support for both new and legacy Expo configurations

## 🔧 **Debugging Steps**

### **Step 1: Check Environment Variables**

```bash
# Verify your .env file contains:
EXPO_PUBLIC_DATADOG_CLIENT_TOKEN=your_token_here
EXPO_PUBLIC_DATADOG_APPLICATION_ID=your_app_id_here
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_key
# ... other Firebase config
```

### **Step 2: Clean Build**

```bash
# Clean EAS build cache
eas build --clear-cache -p android --profile production

# Or for local development
npx expo start --clear
```

### **Step 3: Test Incremental Features**

1. Build without Datadog (comment out initialization)
2. If successful, add Datadog back gradually
3. Test with minimal features first

### **Step 4: Check Build Logs**

```bash
# Get detailed build logs
eas build -p android --profile production --verbose
```

## 🛠️ **Modified Files for Stability**

### **Core Stability Improvements:**

- `/app/_layout.tsx` - Added Error Boundary and safe initialization
- `/config/datadog.ts` - Enhanced error handling and validation
- `/config/safeEnv.ts` - Safe environment variable loading
- `/components/common/ErrorBoundary.tsx` - Production error handling

### **Configuration Changes:**

- Environment variables now use safe getters
- All initialization wrapped in error handlers
- Timeout protection for long-running operations
- Graceful degradation when services fail

## 🚀 **Testing the Fixes**

### **Local Testing:**

```bash
# Test with missing environment variables
EXPO_PUBLIC_DATADOG_CLIENT_TOKEN= npm start

# Test with invalid configuration
EXPO_PUBLIC_DATADOG_CLIENT_TOKEN=invalid npm start
```

### **Production Testing:**

```bash
# Build for production
eas build -p android --profile production

# Test on multiple devices:
# - Fresh install device (no previous app data)
# - Different Android versions
# - Devices with limited storage/memory
```

## 📱 **Production Checklist**

### **Before Building:**

- ✅ All environment variables configured
- ✅ Firebase project properly set up
- ✅ Datadog application created (if using)
- ✅ EAS build configuration verified

### **After Building:**

- ✅ Test on fresh device installations
- ✅ Verify app starts without crashes
- ✅ Check that core functionality works
- ✅ Monitor error tracking in Datadog/Firebase

## 🔍 **Still Experiencing Crashes?**

### **Get Crash Reports:**

1. Check EAS build logs for compilation errors
2. Use `adb logcat` for Android crash logs
3. Check Firebase Crashlytics (if enabled)
4. Review Datadog error tracking (if working)

### **Minimal Reproduction:**

1. Create a minimal version with just core features
2. Add features incrementally until crash reproduces
3. Isolate the problematic component/feature

### **Emergency Fallback:**

If you need to deploy immediately, you can disable Datadog tracking:

```typescript
// In config/datadog.ts - temporarily disable
export const initializeDatadog = async (): Promise<boolean> => {
  console.log("📊 Datadog RUM: Temporarily disabled");
  return false;
};
```

This ensures your app works while you debug the tracking issues.

## 📞 **Getting Help**

If crashes persist after applying these fixes:

1. **Provide Details:**

   - Device model and Android/iOS version
   - Exact error messages from build logs
   - Steps to reproduce the crash
   - Whether it happens on all devices or specific ones

2. **Share Logs:**

   - EAS build logs
   - Device crash logs (`adb logcat`)
   - Any console errors during development

3. **Test Matrix:**
   - Fresh install vs app update
   - Different device types and OS versions
   - With/without network connectivity
