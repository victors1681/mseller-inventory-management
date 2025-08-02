import {
  AVAILABLE_LANGUAGES,
  LanguageCode,
  useTranslation,
} from "@/hooks/useTranslation";
import React from "react";
import { StyleSheet } from "react-native";
import { Button, Divider, Menu } from "react-native-paper";

interface LanguageSelectorProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: React.ReactNode;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onDismiss,
  anchor,
}) => {
  const { changeLanguage, currentLanguage } = useTranslation();

  const handleLanguageChange = async (languageCode: LanguageCode) => {
    try {
      await changeLanguage(languageCode);
      onDismiss();
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return (
    <Menu
      visible={visible}
      onDismiss={onDismiss}
      anchor={anchor}
      contentStyle={styles.menuContent}
    >
      {AVAILABLE_LANGUAGES.map((language, index) => (
        <React.Fragment key={language.code}>
          <Menu.Item
            onPress={() => handleLanguageChange(language.code)}
            title={language.nativeName}
            titleStyle={[
              styles.menuItemTitle,
              currentLanguage === language.code && styles.activeLanguage,
            ]}
            leadingIcon={
              currentLanguage === language.code ? "check" : undefined
            }
          />
          {index < AVAILABLE_LANGUAGES.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Menu>
  );
};

interface LanguageButtonProps {
  onPress: () => void;
}

export const LanguageButton: React.FC<LanguageButtonProps> = ({ onPress }) => {
  const { currentLanguage } = useTranslation();

  const currentLang = AVAILABLE_LANGUAGES.find(
    (lang) => lang.code === currentLanguage
  );

  return (
    <Button
      mode="outlined"
      onPress={onPress}
      icon="translate"
      compact
      style={styles.languageButton}
    >
      {currentLang?.code.toUpperCase() || "EN"}
    </Button>
  );
};

const styles = StyleSheet.create({
  menuContent: {
    backgroundColor: "white",
    borderRadius: 8,
    minWidth: 120,
  },
  menuItemTitle: {
    fontSize: 16,
  },
  activeLanguage: {
    fontWeight: "bold",
    color: "#6200ee",
  },
  languageButton: {
    minWidth: 60,
  },
});
