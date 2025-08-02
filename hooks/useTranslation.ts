import { useTranslation as useI18nTranslation } from "react-i18next";

/**
 * Custom hook for translations with better TypeScript support
 * Usage: const { t } = useTranslation();
 * Example: t('auth.signIn') or t('common.loading')
 */
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  return {
    t,
    changeLanguage: i18n.changeLanguage,
    currentLanguage: i18n.language,
    isRTL: i18n.dir() === "rtl",
  };
};

/**
 * Translation keys for type safety (optional)
 * You can extend this as you add more translation keys
 */
export type TranslationKey =
  // Common
  | "common.loading"
  | "common.error"
  | "common.success"
  | "common.cancel"
  | "common.save"
  | "common.edit"
  | "common.delete"
  | "common.confirm"
  | "common.back"
  | "common.next"
  | "common.retry"
  | "common.refresh"
  | "common.logout"
  | "common.login"
  | "common.signup"
  | "common.email"
  | "common.password"
  | "common.name"
  | "common.firstName"
  | "common.lastName"

  // Auth
  | "auth.signIn"
  | "auth.signUp"
  | "auth.signOut"
  | "auth.forgotPassword"
  | "auth.resetPassword"
  | "auth.createAccount"
  | "auth.alreadyHaveAccount"
  | "auth.dontHaveAccount"
  | "auth.enterEmail"
  | "auth.enterPassword"
  | "auth.enterFirstName"
  | "auth.enterLastName"
  | "auth.passwordResetSent"
  | "auth.checkYourEmail"
  | "auth.invalidCredentials"
  | "auth.accountCreated"
  | "auth.passwordTooWeak"
  | "auth.emailInUse"

  // Profile
  | "profile.profile"
  | "profile.userProfile"
  | "profile.businessInfo"
  | "profile.personalInfo"
  | "profile.company"
  | "profile.userType"
  | "profile.mode"
  | "profile.testMode"
  | "profile.productionMode"
  | "profile.sellerCode"
  | "profile.updateProfile"
  | "profile.profileUpdated"

  // Navigation
  | "navigation.home"
  | "navigation.explore"
  | "navigation.profile"
  | "navigation.apiTest"
  | "navigation.settings"

  // API
  | "api.testApi"
  | "api.refreshToken"
  | "api.refreshProfile"
  | "api.testRequest"
  | "api.tokenRefreshed"
  | "api.profileRefreshed"
  | "api.requestFailed"
  | "api.networkError"
  | "api.unauthorized"
  | "api.serverError"

  // Inventory
  | "inventory.inventory"
  | "inventory.products"
  | "inventory.categories"
  | "inventory.stockLevel"
  | "inventory.lowStock"
  | "inventory.outOfStock"
  | "inventory.addProduct"
  | "inventory.editProduct"
  | "inventory.deleteProduct"
  | "inventory.productName"
  | "inventory.productCode"
  | "inventory.price"
  | "inventory.quantity"
  | "inventory.description"

  // Errors
  | "errors.genericError"
  | "errors.networkError"
  | "errors.timeoutError"
  | "errors.authenticationError"
  | "errors.authorizationError"
  | "errors.validationError"
  | "errors.notFoundError"
  | "errors.serverError"

  // Messages
  | "messages.welcome"
  | "messages.goodbye"
  | "messages.dataSaved"
  | "messages.dataLoaded"
  | "messages.noDataFound"
  | "messages.operationCompleted"
  | "messages.confirmDelete"
  | "messages.unsavedChanges";

/**
 * Available languages
 */
export const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
] as const;

export type LanguageCode = (typeof AVAILABLE_LANGUAGES)[number]["code"];
