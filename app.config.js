/* eslint-disable-next-line import/no-unresolved -- convention.config.json isn't available on github */
import { convention } from './convention.config.json'

const urlMatcher = /^([^:]+):\/\/([^/]+)(\/.*)$/
const [, appBaseProtocol, appBaseHost, appBasePath] = [...convention.appBase.match(urlMatcher)]

module.exports = {
  expo: {
    runtimeVersion: {
      policy: 'appVersion',
    },
    name: 'Eurofurence',
    slug: 'ef-app-react-native',
    description: 'Your one stop shop to the convention!',
    owner: 'eurofurence',
    version: '6.2.3',
    orientation: 'default',
    userInterfaceStyle: 'automatic',
    scheme: 'eurofurence',
    splash: {
      image: './assets/platform/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#1E303E',
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/a60a3199-98db-4eec-8c66-cda6c424377d',
    },
    ios: {
      bundleIdentifier: 'org.eurofurence',
      icon: './assets/platform/appicon-ios.png',
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
      icon: './assets/platform/appicon-android.png',
      googleServicesFile: './assets/platform/google-services.json',
      targetSdkVersion: 35,
      compileSdkVersion: 35,
      edgeToEdgeEnabled: true,
      splash: {
        resizeMode: 'native',
        image: './assets/platform/splash.png',
        backgroundColor: '#1E303E',
      },
      adaptiveIcon: {
        foregroundImage: './assets/platform/appicon-android.png',
        backgroundColor: '#1E303E',
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
          color: '#006459',
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
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: '35.0.0',
          },
        },
      ],
      '@react-native-firebase/app',
      'expo-secure-store',
      'expo-router',
      'expo-font',
      'expo-web-browser',
      'react-native-legal',
    ].filter(Boolean),
    extra: {
      eas: {
        projectId: 'a60a3199-98db-4eec-8c66-cda6c424377d',
      },
    },
  },
}
