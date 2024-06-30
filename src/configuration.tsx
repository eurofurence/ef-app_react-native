import packageData from "../package.json";

/**
 * The name of the convention.
 */
export const conName = packageData.convention.name;

/**
 * The abbreviation for the convention name.
 */
export const conAbbr = packageData.convention.abbreviation;

/**
 * Convention identifier.
 */
export const conId = packageData.convention.identifier;

/**
 * Convention time zone.
 */
export const conTimeZone = packageData.convention.timeZone;

/**
 * App base, non-API URLs are relative to this.
 */
export const appBase = packageData.convention.appBase;

/**
 * API base, API methods are under this URL.
 */
export const apiBase = packageData.convention.apiBase;

/**
 * Number of columns to use in main menu pager.
 */
export const menuColumns = packageData.convention.menuColumns;

/**
 * True if login is available for this convention.
 */
export const showLogin = packageData.convention.showLogin;

/**
 * True if services are available for this convention.
 */
export const showServices = packageData.convention.showServices;

/**
 * True if catch-em-all game is available for this convention.
 */
export const showCatchEm = packageData.convention.showCatchEm;

/**
 * True if dealer view shows attendee.
 */
export const dealerShowAttendee = packageData.convention.dealerShowAttendee;

export const authIssuer = packageData.auth.issuer;
export const authRedirect = packageData.auth.redirect;
export const authClientId = packageData.auth.clientId;
export const authScopes = packageData.auth.scopes;
export const authSettingsUrl = packageData.auth.settingsUrl;
