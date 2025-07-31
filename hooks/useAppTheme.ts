import { CustomTheme, getTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

/**
 * Custom hook that returns the appropriate theme based on the color scheme
 * This hook combines the system color scheme with React Native Paper theme
 */
export const useAppTheme = (): CustomTheme => {
  const colorScheme = useColorScheme();
  return getTheme(colorScheme === "dark");
};

/**
 * Custom hook that returns whether the current theme is dark mode
 */
export const useIsDarkMode = (): boolean => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark";
};
