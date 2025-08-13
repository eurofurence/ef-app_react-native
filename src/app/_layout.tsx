import { AuthProvider } from '@/context/auth/Auth'
import { CacheProvider } from '@/context/data/Cache'
import { QueryProvider } from '@/context/query/Query'
import { ToastProvider } from '@/context/ui/ToastContext'
import { useEventReminderRescheduling } from '@/hooks/data/useEventReminderRescheduling'
import { useStackScreensData } from '@/hooks/data/useStackScreensData'
import { useTheme, useThemeName } from '@/hooks/themes/useThemeHooks'
import { useZoneAbbr } from '@/hooks/time/useZoneAbbr'
import { useTokenManager } from '@/hooks/tokens/useTokenManager'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useMemo } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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
import { useNotificationResponseManager } from '@/hooks/notifications/useNotificationResponseManager'
import { UserProvider } from '@/context/auth/User'

export const unstable_settings = {
  initialRouteName: '(areas)',
}

/**
 * The root layout for the application.
 * This layout is responsible for setting up the main layout and the data cache provider.
 * @constructor
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <QueryProvider>
        <AuthProvider>
          <UserProvider>
            <CacheProvider>
              <ToastProvider>
                <MainLayout />
              </ToastProvider>
            </CacheProvider>
          </UserProvider>
        </AuthProvider>
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
  const segments = useSegments()

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
  useNotificationResponseManager()

  // Check if we're on the exact (areas)/index route
  // TODO: Surely there's a better way to do this?
  const isHomeView = !segments.length || (segments[0] === '(areas)' && (segments.length === 1 || segments.at(1) === 'index'))

  return (
    <SafeAreaProvider onLayout={() => SplashScreen.hide()}>
      <BottomSheetModalProvider>
        <ThemeProvider value={themeNavigation}>
          <StatusBar style={isHomeView ? 'light' : themeType === 'light' || themeType === 'medium' ? 'dark' : 'light'} />
          <Stack initialRouteName="(areas)">
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
        </ThemeProvider>
      </BottomSheetModalProvider>
    </SafeAreaProvider>
  )
}
