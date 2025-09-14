import type { MD3Theme } from "react-native-paper";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// Custom colors extending the existing Colors.ts
const customColors = {
  light: {
    primary: "#0055b3",
    primaryContainer: "#b8e6ff",
    secondary: "#4a6741",
    secondaryContainer: "#ccedc2",
    tertiary: "#3d5f75",
    tertiaryContainer: "#c1e7fd",
    surface: "#ffffff",
    surfaceVariant: "#f1f4f8",
    background: "#ffffff",
    error: "#ba1a1a",
    errorContainer: "#ffdad6",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#001e2c",
    onSecondary: "#ffffff",
    onSecondaryContainer: "#061f0c",
    onTertiary: "#ffffff",
    onTertiaryContainer: "#001e2c",
    onSurface: "#11181c",
    onSurfaceVariant: "#687076",
    onBackground: "#11181c",
    onError: "#ffffff",
    onErrorContainer: "#410002",
    outline: "#8f959a",
    outlineVariant: "#bfc8cd",
    inverseSurface: "#2d3135",
    inverseOnSurface: "#ecedee",
    inversePrimary: "#6dd3ff",
    elevation: {
      level0: "transparent",
      level1: "#f8f9fa",
      level2: "#f1f3f4",
      level3: "#e8eaed",
      level4: "#e4e7ea",
      level5: "#dde1e5",
    },
  },
  dark: {
    primary: "#6dd3ff",
    primaryContainer: "#004d66",
    secondary: "#b0d1a6",
    secondaryContainer: "#32502a",
    tertiary: "#a5cbe1",
    tertiaryContainer: "#24455c",
    surface: "#151718",
    surfaceVariant: "#40484c",
    background: "#151718",
    error: "#ffb4ab",
    errorContainer: "#93000a",
    onPrimary: "#003544",
    onPrimaryContainer: "#b8e6ff",
    onSecondary: "#1b3315",
    onSecondaryContainer: "#ccedc2",
    onTertiary: "#0a3446",
    onTertiaryContainer: "#c1e7fd",
    onSurface: "#ecedee",
    onSurfaceVariant: "#9ba1a6",
    onBackground: "#ecedee",
    onError: "#690005",
    onErrorContainer: "#ffdad6",
    outline: "#949a9f",
    outlineVariant: "#40484c",
    inverseSurface: "#ecedee",
    inverseOnSurface: "#2d3135",
    inversePrimary: "#0a7ea4",
    elevation: {
      level0: "transparent",
      level1: "#1f2225",
      level2: "#252831",
      level3: "#2c2f3b",
      level4: "#2e3240",
      level5: "#31364a",
    },
  },
};

// Create light theme
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors.light,
  },
};

// Create dark theme
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...customColors.dark,
  },
};

// Custom theme extensions (for additional properties)
export interface CustomTheme extends MD3Theme {
  custom: {
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    borderRadius: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    shadows: {
      small: object;
      medium: object;
      large: object;
    };
  };
}

// Extended themes with custom properties
const customExtensions = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  shadows: {
    small: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

export const customLightTheme: CustomTheme = {
  ...lightTheme,
  custom: customExtensions,
};

export const customDarkTheme: CustomTheme = {
  ...darkTheme,
  custom: customExtensions,
};

// Export theme getter function
export const getTheme = (isDark: boolean): CustomTheme => {
  return isDark ? customDarkTheme : customLightTheme;
};

// Type for theme colors (for TypeScript support)
export type ThemeColors = typeof customColors.light;
