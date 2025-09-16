#!/bin/bash

# Template script for setting up environment variables in Expo
# This script contains placeholders - replace with your actual values

echo "🚀 Setting up environment variables for MSeller Lite..."
echo "⚠️  This is a template script. Replace placeholder values with your actual credentials."
echo ""

# Check if user wants to proceed
read -p "Have you replaced all placeholder values with your actual credentials? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "❌ Please update the script with your actual credentials first."
    exit 1
fi

# Production Environment Variables
echo "📦 Setting production environment variables..."

# Firebase Configuration (replace these with your actual values)
FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY_HERE"
FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN_HERE"
FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID_HERE"
FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET_HERE"
FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID_HERE"
FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID_HERE"
FIREBASE_DATABASE_URL="YOUR_FIREBASE_DATABASE_URL_HERE"
FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID_HERE"

# Datadog Configuration (replace these with your actual values)
DATADOG_CLIENT_TOKEN="YOUR_DATADOG_CLIENT_TOKEN_HERE"
DATADOG_APPLICATION_ID="YOUR_DATADOG_APPLICATION_ID_HERE"

# Validate that values have been replaced
if [[ "$FIREBASE_API_KEY" == "YOUR_FIREBASE_API_KEY_HERE" ]]; then
    echo "❌ Error: Please replace placeholder values with your actual credentials!"
    echo "📝 Edit this script and replace all 'YOUR_*_HERE' values with your actual credentials."
    exit 1
fi

# Create environment variables for production
eas env:create production --name EXPO_PUBLIC_FIREBASE_API_KEY --value "$FIREBASE_API_KEY" --visibility plaintext --non-interactive
eas env:create production --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value "$FIREBASE_AUTH_DOMAIN" --visibility plaintext --non-interactive
eas env:create production --name EXPO_PUBLIC_FIREBASE_PROJECT_ID --value "$FIREBASE_PROJECT_ID" --visibility plaintext --non-interactive
eas env:create production --name EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET --value "$FIREBASE_STORAGE_BUCKET" --visibility plaintext --non-interactive
eas env:create production --name EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --value "$FIREBASE_MESSAGING_SENDER_ID" --visibility plaintext --non-interactive
eas env:create production --name EXPO_PUBLIC_FIREBASE_APP_ID --value "$FIREBASE_APP_ID" --visibility plaintext --non-interactive
eas env:create production --name EXPO_PUBLIC_FIREBASE_DATABASE_URL --value "$FIREBASE_DATABASE_URL" --visibility plaintext --non-interactive
eas env:create production --name EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID --value "$FIREBASE_MEASUREMENT_ID" --visibility plaintext --non-interactive
eas env:create production --name EXPO_PUBLIC_DATADOG_CLIENT_TOKEN --value "$DATADOG_CLIENT_TOKEN" --visibility sensitive --non-interactive
eas env:create production --name EXPO_PUBLIC_DATADOG_APPLICATION_ID --value "$DATADOG_APPLICATION_ID" --visibility sensitive --non-interactive

# Create environment variables for preview
echo "🔍 Setting preview environment variables..."
eas env:create preview --name EXPO_PUBLIC_FIREBASE_API_KEY --value "$FIREBASE_API_KEY" --visibility plaintext --non-interactive
eas env:create preview --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value "$FIREBASE_AUTH_DOMAIN" --visibility plaintext --non-interactive
eas env:create preview --name EXPO_PUBLIC_FIREBASE_PROJECT_ID --value "$FIREBASE_PROJECT_ID" --visibility plaintext --non-interactive
eas env:create preview --name EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET --value "$FIREBASE_STORAGE_BUCKET" --visibility plaintext --non-interactive
eas env:create preview --name EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --value "$FIREBASE_MESSAGING_SENDER_ID" --visibility plaintext --non-interactive
eas env:create preview --name EXPO_PUBLIC_FIREBASE_APP_ID --value "$FIREBASE_APP_ID" --visibility plaintext --non-interactive
eas env:create preview --name EXPO_PUBLIC_FIREBASE_DATABASE_URL --value "$FIREBASE_DATABASE_URL" --visibility plaintext --non-interactive
eas env:create preview --name EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID --value "$FIREBASE_MEASUREMENT_ID" --visibility plaintext --non-interactive
eas env:create preview --name EXPO_PUBLIC_DATADOG_CLIENT_TOKEN --value "$DATADOG_CLIENT_TOKEN" --visibility sensitive --non-interactive
eas env:create preview --name EXPO_PUBLIC_DATADOG_APPLICATION_ID --value "$DATADOG_APPLICATION_ID" --visibility sensitive --non-interactive

echo "✅ Environment variables setup complete!"
echo ""
echo "🔍 Verifying setup..."
eas env:list

echo ""
echo "🎯 Next steps:"
echo "1. Run: eas build -p android --profile preview --clear-cache"
echo "2. Test the preview build on your device"
echo "3. If it works, run: eas build -p android --profile production --clear-cache"
echo ""
echo "🗑️  Important: Delete this script after use to avoid exposing credentials!"
