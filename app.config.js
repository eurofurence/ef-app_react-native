import 'dotenv/config'

const appBase = process.env.EXPO_PUBLIC_CONVENTION_APPBASE

const urlMatcher = /^([^:]+):\/\/([^/]+)(\/.*)$/
const [, appBaseProtocol, appBaseHost, appBasePath] = [
  ...appBase.match(urlMatcher),
]

module.exports = {
  expo: {
    runtimeVersion: {
      policy: 'appVersion',
    },
    name: 'Eurofurence',
    slug: 'ef-app-react-native',
    description: 'Your one stop shop to the convention!',
    owner: 'eurofurence',
    version: '6.3.0',
    orientation: 'default',
    userInterfaceStyle: 'automatic',
    scheme: 'eurofurence',
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
        monochromeImage: './assets/platform/appicon-android-monochrome.png',
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
      ],
      permissions: ['INTERNET', 'VIBRATE', 'WRITE_EXTERNAL_STORAGE'],
      blockedPermissions: ['com.google.android.gms.permission.AD_ID', 'android.permission.RECORD_AUDIO'],
    },
    web: {
      bundler: 'metro',
      favicon: './assets/platform/appicon-android.png',
    },
    plugins: [
      // Run sentry plugin only if auth token is given, otherwise the build crashes.
      Boolean(global.process.env.SENTRY_AUTH_TOKEN) && [
        '@sentry/react-native/expo',
        {
          project: 'ef-app_react-native',
          organization: 'eurofurence',
        },
      ],
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
            deploymentTarget: '15.1',
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
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#005953",
          "image": "./assets/platform/splash.png",
          "imageWidth": 200
        }
      ],
      'expo-router',
      'expo-web-browser',
      'expo-image',
      'react-native-legal',
    ].filter(Boolean),
    extra: {
      eas: {
        projectId: 'a60a3199-98db-4eec-8c66-cda6c424377d',
      },
    },
  },
}
