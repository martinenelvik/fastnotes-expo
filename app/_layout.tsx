import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NotesProvider } from "../context/NotesContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <NotesProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 220,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="note/[id]" />
          </Stack>
        </NotesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
