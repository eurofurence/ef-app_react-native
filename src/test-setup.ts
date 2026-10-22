import { mock } from 'bun:test'

// Metro injects __DEV__ at build time; bun test has no bundler, so modules that
// read it (expo's async-require setup, src/configuration) throw on import.
;(globalThis as { __DEV__?: boolean }).__DEV__ = false

// The real module imports react-native, which bun cannot parse (Flow syntax), so
// it is mirrored here from the same env vars. Bun's mock registry is
// process-global: this has to stay the full export surface, because a narrower
// per-file mock leaks into every file that runs after it.
mock.module('@/configuration', () => ({
  conName: process.env.EXPO_PUBLIC_CONVENTION_NAME,
  conAbbr: process.env.EXPO_PUBLIC_CONVENTION_ABBREVIATION,
  conId: process.env.EXPO_PUBLIC_CONVENTION_IDENTIFIER,
  conTimeZone: process.env.EXPO_PUBLIC_CONVENTION_TIMEZONE,
  conWebsite: process.env.EXPO_PUBLIC_CONVENTION_WEBSITE,
  appBase: process.env.EXPO_PUBLIC_CONVENTION_APPBASE,
  apiBase: process.env.EXPO_PUBLIC_CONVENTION_APIBASE,
  showLogin: process.env.EXPO_PUBLIC_CONVENTION_SHOWLOGIN,
  artistAlleyUrl: process.env.EXPO_PUBLIC_CONVENTION_ARTISTALLEYURL,
  registrationDatesUrl: process.env.EXPO_PUBLIC_CONVENTION_REGISTRATIONDATESURL,
  registrationUrl: process.env.EXPO_PUBLIC_CONVENTION_REGISTRATIONURL,
  avatarBase: process.env.EXPO_PUBLIC_CONVENTION_AVATARBASE,
  eurofurenceCacheVersion: Number(
    process.env.EXPO_PUBLIC_CONVENTION_CACHEVERSION
  ),
  authIssuer: process.env.EXPO_PUBLIC_AUTH_ISSUER,
  authRedirect: process.env.EXPO_PUBLIC_AUTH_REDIRECT,
  authClientId: process.env.EXPO_PUBLIC_AUTH_CLIENTID,
  authScopes: JSON.parse(process.env.EXPO_PUBLIC_AUTH_SCOPES || '[]'),
  authSettingsUrl: process.env.EXPO_PUBLIC_AUTH_SETTINGSURL,
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  sentryEnvironment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT,
  cacheDebug: process.env.EXPO_PUBLIC_DEBUG_SHOWCACHE,
  devMenu: process.env.EXPO_PUBLIC_DEBUG_DEVMENU,
  i18nDebug: process.env.EXPO_PUBLIC_DEBUG_I18NDEBUG,
  firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_APIKEY,
  firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN,
  firebaseDatabaseUrl: process.env.EXPO_PUBLIC_FIREBASE_DATABASEURL,
  firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECTID,
  firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET,
  firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
  firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENTID,
}))
