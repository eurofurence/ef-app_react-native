import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStackScreensData } from '@/hooks/data/useStackScreensData'
import { CacheProvider } from '@/context/data/Cache'
import { useTheme, useThemeBackground, useThemeName } from '@/hooks/themes/useThemeHooks'
import { AuthProvider } from '@/context/auth/Auth'
import { useEventReminderRescheduling } from '@/hooks/data/useEventReminderRescheduling'
import { useZoneAbbr } from '@/hooks/time/useZoneAbbr'
import { QueryProvider } from '@/context/query/Query'
import { ToastProvider } from '@/context/ui/ToastContext'
import { useTokenManager } from '@/hooks/tokens/useTokenManager'

// Import i18n configuration
import '@/i18n'

// Import initializer scripts
import '@/init/firebaseApp'
import '@/init/sentryInit'
import '@/init/setNotificationChannels'
import '@/init/setNotificationHandler'
import '@/init/splash'

// Import global tailwind CSS.
import '@/css/globals.css'

/**
 * The root layout for the application.
 * This layout is responsible for setting up the main layout and the data cache provider.
 * @constructor
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <QueryProvider>
        <CacheProvider>
          <AuthProvider>
            <ToastProvider>
              <MainLayout />
            </ToastProvider>
          </AuthProvider>
        </CacheProvider>
      </QueryProvider>
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

  const safeAreaStyle = useThemeBackground('surface')
  const screensData = useStackScreensData()

  // Wraps the app theme for react navigation.
  const themeNavigation = useMemo(
    () => ({
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
    [themeType, theme]
  )

  useZoneAbbr()
  useEventReminderRescheduling()
  useTokenManager()

  return (
    <BottomSheetModalProvider>
      <ThemeProvider value={themeNavigation}>
        <StatusBar backgroundColor={theme.background} style={themeType === 'light' ? 'dark' : 'light'} />
        <SafeAreaView style={[StyleSheet.absoluteFill, safeAreaStyle]} onLayout={() => SplashScreen.hide()}>
          <Stack>
            {screensData.map((screen) => (
              <Stack.Screen
                key={screen.location}
                name={screen.location}
                options={{
                  freezeOnBlur: screen.freezeOnBlur,
                  keyboardHandlingEnabled: true,
                  headerTitleAlign: 'left',
                  headerShown: screen.headerShown,
                  headerTitle: screen.title,
                  headerLargeTitle: screen.headerLargeTitle,
                  headerLeft: screen.headerLeft,
                  headerRight: screen.headerRight,
                  gestureEnabled: screen.swipeEnabled || false,
                }}
              />
            ))}
          </Stack>
        </SafeAreaView>
      </ThemeProvider>
    </BottomSheetModalProvider>
  )
}
