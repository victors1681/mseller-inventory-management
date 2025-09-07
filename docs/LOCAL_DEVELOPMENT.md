# Local Development Setup

This document explains how to run the MSeller Inventory Management app in local development mode.

## Overview

The app supports two modes:

- **Production Mode**: Uses header-based routing via user configuration
- **Local Development Mode**: Bypasses user configuration and connects directly to `https://localhost:7174`

## Usage

### Start in Local Development Mode

```bash
# Start development server in local mode
npm run start:local

# Start on specific platforms in local mode
npm run android:local
npm run ios:local
npm run web:local
```

### Start in Production Mode

```bash
# Regular production mode (default)
npm start
npm run android
npm run ios
npm run web
```

## How It Works

When you use the `:local` scripts, the following environment variables are set:

- `EXPO_PUBLIC_LOCAL_MODE=true`
- `EXPO_PUBLIC_USE_LOCAL_API=true`

The app automatically detects these variables and:

1. Sets `baseURL: "https://localhost:7174"` on the axios client
2. Skips user-based URL configuration
3. Shows a "LOCAL" indicator in the demo screen
4. Logs the configuration on startup

## Environment Detection

The app checks the following conditions for local mode:

- `process.env.EXPO_PUBLIC_LOCAL_MODE === 'true'`
- `process.env.NODE_ENV === 'development'` AND `process.env.EXPO_PUBLIC_USE_LOCAL_API === 'true'`

## Local Server Requirements

Your local development server must:

- Run on `https://localhost:7174`
- Support the MSeller Inventory Management API endpoints
- Handle CORS for React Native requests
- Use HTTPS (not HTTP) for mobile compatibility

## Visual Indicators

When running in local mode, you'll see:

- A green "LOCAL" chip in the inventory demo screen header
- Console logs showing the environment configuration
- Local server URL displayed in the demo screen

## Configuration Files

- `config/environment.ts` - Environment detection logic
- `services/api.ts` - Axios client configuration
- `package.json` - npm scripts for local development

## Troubleshooting

1. **Local server not responding**: Ensure your server is running on `https://localhost:7174`
2. **CORS issues**: Configure your local server to allow React Native origins
3. **Environment not detected**: Check that environment variables are set correctly
4. **Certificate issues**: Ensure your local server uses valid HTTPS certificates
