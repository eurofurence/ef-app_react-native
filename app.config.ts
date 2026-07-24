import 'dotenv/config'

import type { ExpoConfig } from 'expo/config'
import { withGradleProperties } from 'expo/config-plugins'

import { version } from './package.json'

const appBase = process.env.EXPO_PUBLIC_CONVENTION_APPBASE
if (!appBase) throw new Error('EXPO_PUBLIC_CONVENTION_APPBASE is not set')

const urlMatcher = /^([^:]+):\/\/([^/]+)(\/.*)$/
const appBaseMatch = appBase.match(urlMatcher)
if (!appBaseMatch) throw new Error(`EXPO_PUBLIC_CONVENTION_APPBASE is not a valid URL: ${appBase}`)
const [, appBaseProtocol, appBaseHost, appBasePath] = appBaseMatch

// Root splash and android.newArchEnabled were dropped from the SDK config types; kept for parity with the old JS config.
const config: ExpoConfig & {
  splash?: Record<string, unknown>
  android?: { newArchEnabled?: boolean }
} = {
  runtimeVersion: {
    policy: 'appVersion',
  },
  name: 'Eurofurence',
  slug: 'ef-app-react-native',
  description: 'Your one stop shop to the convention!',
  owner: 'eurofurence',
  version,
  orientation: 'default',
  userInterfaceStyle: 'automatic',
  scheme: ['eurofurence', 'eventwifi'],
  splash: {
    image: './assets/platform/splash.png',
    resizeMode: 'native',
    backgroundColor: '#005953',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/a60a3199-98db-4eec-8c66-cda6c424377d',
  },
  ios: {
    bundleIdentifier: 'org.eurofurence',
    icon: './assets/platform/appicon-ios.icon',
    googleServicesFile: './assets/platform/GoogleService-Info.plist',
    supportsTablet: true,
    infoPlist: {
      UIBackgroundModes: ['fetch', 'remote-notification'],
      ITSAppUsesNonExemptEncryption: false,
      NSMicrophoneUsageDescription: false,
    },
    associatedDomains: ['applinks:app.eurofurence.org', 'applinks:app.test.eurofurence.org'],
  },
  android: {
    package: 'org.eurofurence.connavigator',
    googleServicesFile: './assets/platform/google-services.json',
    newArchEnabled: true,
    adaptiveIcon: {
      foregroundImage: './assets/platform/appicon-android.png',
      backgroundColor: '#005953',
    },
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: appBaseProtocol,
            host: appBaseHost,
            pathPrefix: `${appBasePath}/Web`,
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: appBaseProtocol,
            host: appBaseHost,
            path: '/auth/login',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'wifi.onsite.eurofurence.org',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
    permissions: ['INTERNET', 'VIBRATE', 'WRITE_EXTERNAL_STORAGE', 'CHANGE_WIFI_STATE', 'ACCESS_WIFI_STATE'],
    blockedPermissions: ['com.google.android.gms.permission.AD_ID', 'android.permission.RECORD_AUDIO'],
  },
  web: {
    bundler: 'metro',
    favicon: './assets/platform/appicon-android.png',
  },
  experiments: {
    baseUrl: '/ef-app_react-native',
    reactCompiler: true,
    typedRoutes: true,
  },
  plugins: [
    // Run sentry plugin only if auth token is given, otherwise the build crashes.
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [
          [
            '@sentry/react-native',
            {
              project: 'ef-app_react-native',
              organization: 'eurofurence',
            },
          ] as [string, object],
        ]
      : []),
    // Font for vector icons.
    'expo-font',
    // Import assets statically.
    [
      'expo-asset',
      {
        assets: ['./assets/static'],
      },
    ],
    // Used to display push notifications.
    [
      'expo-notifications',
      {
        icon: './assets/platform/notification.png',
        color: '#005953',
      },
    ],
    // Used to render audio.
    [
      'expo-audio',
      {
        microphonePermission: false,
        enableMicrophone: false,
      },
    ],
    // Used for Artist Alley registration
    [
      'expo-image-picker',
      {
        photosPermission: 'The app accesses your photos if you want to register for a table in the Artist Alley.',
      },
    ],
    'expo-localization',
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '16.4',
          useFrameworks: 'static',
          cacheEnabled: true,
          privacyManifestAggregationEnabled: true,
        },
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          buildToolsVersion: '36.0.0',
        },
      },
    ],
    '@react-native-firebase/app',
    'expo-secure-store',
    'expo-status-bar',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#005953',
        image: './assets/platform/splash.png',
        imageWidth: 200,
      },
    ],
    'expo-router',
    'expo-web-browser',
    'expo-image',
    'react-native-legal',
    [
      'expo-camera',
      {
        cameraPermission: 'Eurofurence uses the camera to scan WiFi setup QR codes.',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'a60a3199-98db-4eec-8c66-cda6c424377d',
    },
  },
}

// Prebuild's default jvmargs (2g heap/512m metaspace) OOM the Gradle daemon during lintVitalAnalyzeRelease.
export default withGradleProperties(config, (config) => {
  config.modResults = config.modResults.filter((item) => !(item.type === 'property' && item.key === 'org.gradle.jvmargs'))
  config.modResults.push({
    type: 'property',
    key: 'org.gradle.jvmargs',
    value: '-Xmx4096m -XX:MaxMetaspaceSize=1024m',
  })
  return config
})
