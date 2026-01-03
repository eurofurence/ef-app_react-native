/**
 * The name of the convention.
 */
export const conName = process.env.EXPO_PUBLIC_CONVENTION_NAME

/**
 * The abbreviation for the convention name.
 */
export const conAbbr = process.env.EXPO_PUBLIC_CONVENTION_ABBREVIATION

/**
 * Convention identifier.
 */
export const conId = process.env.EXPO_PUBLIC_CONVENTION_IDENTIFIER

/**
 * Convention time zone.
 */
export const conTimeZone = process.env.EXPO_PUBLIC_CONVENTION_TIMEZONE

/**
 * Convention website URL.
 */
export const conWebsite = process.env.EXPO_PUBLIC_CONVENTION_WEBSITE

/**
 * EFNav map URL
 */
export const efnavMapUrl = process.env.EXPO_PUBLIC_CONVENTION_EFNAVMAPURL

/**
 * App base, non-API URLs are relative to this.
 */
export const appBase = process.env.EXPO_PUBLIC_CONVENTION_APPBASE

/**
 * API base, API methods are under this URL.
 */
export const apiBase = process.env.EXPO_PUBLIC_CONVENTION_APIBASE

/**
 * Number of columns to use in main menu pager.
 */
export const menuColumns = process.env.EXPO_PUBLIC_CONVENTION_MENUCOLUMNS

/**
 * True if login is available for this convention.
 */
export const showLogin = process.env.EXPO_PUBLIC_CONVENTION_SHOWLOGIN

/**
 * True if Catch 'em All game is available for this convention.
 */
export const showCatchEm = process.env.EXPO_PUBLIC_CONVENTION_SHOWCATCHEM

/**
 * URL for accessing the Catch 'em All game for this convention.
 */
export const catchEmUrl = process.env.EXPO_PUBLIC_CONVENTION_CATCHEMURL

/**
 * URL leading to the Artist Alley detail page for this convention.
 */
export const artistAlleyUrl = process.env.EXPO_PUBLIC_CONVENTION_ARTISTALLEYURL

/**
 * Registration configuration for this convention.
 */
export const registrationDatesUrl =
  process.env.EXPO_PUBLIC_CONVENTION_REGISTRATIONDATESURL
export const registrationUrl =
  process.env.EXPO_PUBLIC_CONVENTION_REGISTRATIONURL
export const avatarBase = process.env.EXPO_PUBLIC_CONVENTION_AVATARBASE

/**
 * The cache version for this convention.
 */
export const eurofurenceCacheVersion =
  process.env.EXPO_PUBLIC_CONVENTION_CACHEVERSION

/**
 * Eurofurence Identity Provider Settings
 */
export const authIssuer = process.env.EXPO_PUBLIC_AUTH_ISSUER
export const authRedirect = process.env.EXPO_PUBLIC_AUTH_REDIRECT
export const authClientId = process.env.EXPO_PUBLIC_AUTH_CLIENTID
export const authScopes = JSON.parse(
  process.env.EXPO_PUBLIC_AUTH_SCOPES || '[]'
)
export const authSettingsUrl = process.env.EXPO_PUBLIC_AUTH_SETTINGSURL

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
