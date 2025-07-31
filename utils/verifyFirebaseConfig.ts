/**
 * Firebase Configuration Verification Script
 *
 * This script helps verify that your Firebase environment variables are correctly configured.
 * Run this in your app to check if Firebase is properly initialized.
 */

import { firebaseConfig } from "../config/firebase";

export const verifyFirebaseConfig = () => {
  console.log("🔥 Firebase Configuration Verification");
  console.log("=====================================");

  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  let allConfigured = true;

  requiredFields.forEach((field) => {
    const value = firebaseConfig[field as keyof typeof firebaseConfig];
    const isConfigured =
      value &&
      value !== `your-${field.toLowerCase().replace(/([A-Z])/g, "-$1")}`;

    console.log(
      `${isConfigured ? "✅" : "❌"} ${field}: ${
        isConfigured ? "Configured" : "Missing or using placeholder"
      }`
    );

    if (!isConfigured) {
      allConfigured = false;
    }
  });

  console.log("=====================================");

  if (allConfigured) {
    console.log("🎉 All Firebase configuration fields are properly set!");
    console.log("You can now use Firebase Authentication in your app.");
  } else {
    console.log("⚠️  Some Firebase configuration fields are missing.");
    console.log("Please check your .env file and update the missing values.");
    console.log("Refer to .env.example for the required format.");
  }

  return allConfigured;
};

// Optional: Auto-run verification in development
if (__DEV__) {
  setTimeout(() => {
    verifyFirebaseConfig();
  }, 1000);
}
