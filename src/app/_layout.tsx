import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DrawerProps, useDrawerScreensData } from '@/components/data/DrawerScreensData'
import { CacheProvider, StoreData } from '@/context/data/Cache'
import { useTheme, useThemeMemo, useThemeName } from '@/hooks/themes/useThemeHooks'
// Import i18n configuration
import '@/i18n'
// Import global tailwind css
import { AuthContextProvider } from '@/context/AuthContext'
import '@/css/globals.css'
import { syncReminders } from '@/util/syncReminders'

/**
 * These actions happen after all data is synchronized and can react to new data
 * and return an updated state.
 * @param data The incoming state.
 */
async function postSync(data: StoreData): Promise<StoreData> {
    // Updates notifications scheduled on the device and stores the new
    // notification metadata.
    data = await syncReminders(data)

    return data
}

/**
 * The root layout for the application.
 * This layout is responsible for setting up the main layout and the data cache provider.
 * @constructor
 */
export default function RootLayout() {
    return (
        <GestureHandlerRootView>
            <CacheProvider postSync={postSync}>
                <MainLayout />
            </CacheProvider>
        </GestureHandlerRootView>
    )
}

/**
 * The main layout for the application.
 * @constructor
 */
export function MainLayout() {
    // Get the theme type for status bar configuration.
    const theme = useTheme()
    const themeType = useThemeName()

    const safeAreaStyle = useThemeMemo((theme) => ({ ...StyleSheet.absoluteFillObject, backgroundColor: theme.background }))
    const DrawerScreensData = useDrawerScreensData()

    // Wraps the app theme for react navigation.
    const themeNavigation = useMemo(() =>
            ({
                ...(themeType === 'dark' ? DarkTheme : DefaultTheme),
                colors: {
                    primary: theme.secondary,
                    background: theme.surface,
                    card: theme.background,
                    text: theme.text,
                    border: theme.darken,
                    notification: theme.notification,
                },
            }),
        [themeType, theme],
    )

    return (
        <BottomSheetModalProvider>
            <ThemeProvider value={themeNavigation}>
                <AuthContextProvider>
                    <StatusBar backgroundColor={theme.background} style={themeType === 'light' ? 'dark' : 'light'} />
                    <SafeAreaView style={safeAreaStyle}>
                        <Stack>
                            {DrawerScreensData.map((screen: DrawerProps) => (
                                <Stack.Screen
                                    key={screen.location}
                                    name={screen.location}
                                    options={{
                                        keyboardHandlingEnabled: true,
                                        headerTitleAlign: 'left',
                                        headerShown: screen.headerShown,
                                        headerTitle: screen.title,
                                        headerLargeTitle: screen.headerLargeTitle,
                                        headerLeft: () => screen.headerLeft,
                                        headerRight: () => screen.headerRight,
                                        gestureEnabled: screen.swipeEnabled || false,
                                    }}
                                />
                            ))}
                        </Stack>
                    </SafeAreaView>
                </AuthContextProvider>
            </ThemeProvider>
        </BottomSheetModalProvider>
    )
}
