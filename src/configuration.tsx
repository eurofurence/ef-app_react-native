import { Platform } from 'react-native'

/**
 * Asserts that a required environment variable is set.
 */
function required(value: string | undefined, name: string): string {
  if (value === undefined)
    throw new Error(`Missing environment variable: ${name}`)
  return value
}

/**
 * The name of the convention.
 */
export const conName = required(
  process.env.EXPO_PUBLIC_CONVENTION_NAME,
  'EXPO_PUBLIC_CONVENTION_NAME'
)

/**
 * The abbreviation for the convention name.
 */
export const conAbbr = required(
  process.env.EXPO_PUBLIC_CONVENTION_ABBREVIATION,
  'EXPO_PUBLIC_CONVENTION_ABBREVIATION'
)

/**
 * Convention identifier.
 */
export const conId = required(
  process.env.EXPO_PUBLIC_CONVENTION_IDENTIFIER,
  'EXPO_PUBLIC_CONVENTION_IDENTIFIER'
)

/**
 * Convention time zone.
 */
export const conTimeZone = required(
  process.env.EXPO_PUBLIC_CONVENTION_TIMEZONE,
  'EXPO_PUBLIC_CONVENTION_TIMEZONE'
)

/**
 * Convention website URL.
 */
export const conWebsite = required(
  process.env.EXPO_PUBLIC_CONVENTION_WEBSITE,
  'EXPO_PUBLIC_CONVENTION_WEBSITE'
)

/**
 * App base, non-API URLs are relative to this.
 */
export const appBase = required(
  process.env.EXPO_PUBLIC_CONVENTION_APPBASE,
  'EXPO_PUBLIC_CONVENTION_APPBASE'
)

/**
 * API base, API methods are under this URL.
 */
export const apiBase = required(
  process.env.EXPO_PUBLIC_CONVENTION_APIBASE,
  'EXPO_PUBLIC_CONVENTION_APIBASE'
)

/**
 * Number of columns to use in main menu pager.
 */
export const menuColumns = Number(
  required(
    process.env.EXPO_PUBLIC_CONVENTION_MENUCOLUMNS,
    'EXPO_PUBLIC_CONVENTION_MENUCOLUMNS'
  )
)

/**
 * True if login is available for this convention.
 */
export const showLogin = process.env.EXPO_PUBLIC_CONVENTION_SHOWLOGIN

/**
 * URL leading to the Artist Alley detail page for this convention.
 */
export const artistAlleyUrl = required(
  process.env.EXPO_PUBLIC_CONVENTION_ARTISTALLEYURL,
  'EXPO_PUBLIC_CONVENTION_ARTISTALLEYURL'
)

/**
 * Registration configuration for this convention.
 */
export const registrationDatesUrl = required(
  process.env.EXPO_PUBLIC_CONVENTION_REGISTRATIONDATESURL,
  'EXPO_PUBLIC_CONVENTION_REGISTRATIONDATESURL'
)
export const registrationUrl = required(
  process.env.EXPO_PUBLIC_CONVENTION_REGISTRATIONURL,
  'EXPO_PUBLIC_CONVENTION_REGISTRATIONURL'
)
export const avatarBase = required(
  process.env.EXPO_PUBLIC_CONVENTION_AVATARBASE,
  'EXPO_PUBLIC_CONVENTION_AVATARBASE'
)

/**
 * The cache version for this convention.
 */
export const eurofurenceCacheVersion = Number(
  required(
    process.env.EXPO_PUBLIC_CONVENTION_CACHEVERSION,
    'EXPO_PUBLIC_CONVENTION_CACHEVERSION'
  )
)

/**
 * Eurofurence Identity Provider Settings
 */
export const authIssuer = required(
  process.env.EXPO_PUBLIC_AUTH_ISSUER,
  'EXPO_PUBLIC_AUTH_ISSUER'
)
export const authRedirect =
  Platform.OS === 'web'
    ? `${window.location.origin}${__DEV__ ? '' : (process.env.EXPO_BASE_URL ?? '')}/auth/login`
    : required(
        process.env.EXPO_PUBLIC_AUTH_REDIRECT,
        'EXPO_PUBLIC_AUTH_REDIRECT'
      )
export const authClientId = required(
  process.env.EXPO_PUBLIC_AUTH_CLIENTID,
  'EXPO_PUBLIC_AUTH_CLIENTID'
)
export const authScopes = JSON.parse(
  process.env.EXPO_PUBLIC_AUTH_SCOPES || '[]'
)
export const authSettingsUrl = required(
  process.env.EXPO_PUBLIC_AUTH_SETTINGSURL,
  'EXPO_PUBLIC_AUTH_SETTINGSURL'
)

/**
 * Sentry settings
 */
export const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN
export const sentryEnvironment = process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT

/**
 * Debug settings
 */
export const cacheDebug = process.env.EXPO_PUBLIC_DEBUG_SHOWCACHE
export const devMenu = process.env.EXPO_PUBLIC_DEBUG_DEVMENU
export const i18nDebug = process.env.EXPO_PUBLIC_DEBUG_I18NDEBUG

/**
 * Firebase settings
 */
export const firebaseApiKey = process.env.EXPO_PUBLIC_FIREBASE_APIKEY
export const firebaseAuthDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN
export const firebaseDatabaseUrl = process.env.EXPO_PUBLIC_FIREBASE_DATABASEURL
export const firebaseProjectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECTID
export const firebaseStorageBucket =
  process.env.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET
export const firebaseMessagingSenderId =
  process.env.EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID
export const firebaseAppId = process.env.EXPO_PUBLIC_FIREBASE_APPID
export const firebaseMeasurementId =
  process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENTID
