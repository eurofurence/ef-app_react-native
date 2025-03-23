import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { StyleSheet } from "react-native";
import { useTheme, useThemeMemo, useThemeName } from "@/hooks/themes/useThemeHooks";
import { useColorScheme } from "@/hooks/themes/useColorScheme";
import { DrawerProps, DrawerScreensData } from "@/components/data/DrawerScreensData";
import { DataCacheProvider } from "@/context/DataCacheProvider";
import { useBackgroundSyncManager } from "@/hooks/sync/useBackgroundSyncManager";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// Import i18n configuration
import "@/i18n";
// Import global tailwind css
import "@/css/globals.css";

/**
 * The root layout for the application.
 * This layout is responsible for setting up the main layout and the data cache provider.
 * @constructor
 */
export default function RootLayout() {
    return (
        <GestureHandlerRootView>
            <DataCacheProvider>
                <MainLayout />
            </DataCacheProvider>
        </GestureHandlerRootView>
    );
}

/**
 * The main layout for the application.
 * @constructor
 */
export function MainLayout() {
    const colorScheme = useColorScheme();
    // Get the theme type for status bar configuration.
    const theme = useTheme();
    const themeType = useThemeName();

    const safeAreaStyle = useThemeMemo((theme) => ({ ...StyleSheet.absoluteFillObject, backgroundColor: theme.background }));

    useBackgroundSyncManager();
    return (
            <BottomSheetModalProvider>
                <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                    <StatusBar backgroundColor={theme.background} style={themeType === "light" ? "dark" : "light"} />
                    <SafeAreaView style={safeAreaStyle}>
                            <Stack>
                                {DrawerScreensData.map((screen: DrawerProps) => (
                                    <Stack.Screen
                                        key={screen.location}
                                        name={screen.location}
                                        options={{
                                            keyboardHandlingEnabled: true,
                                            headerTitleAlign: "left",
                                            headerShown: screen.headerShown,
                                            headerTitle: screen.title,
                                            headerLargeTitle: screen.headerLargeTitle,
                                            headerLeft: () => screen.headerLeft,
                                            headerRight: () => screen.headerRight,
                                        }}
                                    />
                                ))}
                            </Stack>
                    </SafeAreaView>
                </ThemeProvider>
            </BottomSheetModalProvider>
    );
}
