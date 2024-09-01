import conventionConfig from "../convention.config.json";

/**
 * The name of the convention.
 */
export const conName = conventionConfig.convention.name;

/**
 * The abbreviation for the convention name.
 */
export const conAbbr = conventionConfig.convention.abbreviation;

/**
 * Convention identifier.
 */
export const conId = conventionConfig.convention.identifier;

/**
 * Convention time zone.
 */
export const conTimeZone = conventionConfig.convention.timeZone;

/**
 * Convention website URL.
 */
export const conWebsite = conventionConfig.convention.website;

/**
 * App base, non-API URLs are relative to this.
 */
export const appBase = conventionConfig.convention.appBase;

/**
 * API base, API methods are under this URL.
 */
export const apiBase = conventionConfig.convention.apiBase;

/**
 * Number of columns to use in main menu pager.
 */
export const menuColumns = conventionConfig.convention.menuColumns;

/**
 * True if login is available for this convention.
 */
export const showLogin = conventionConfig.convention.showLogin;

/**
 * True if services are available for this convention.
 */
export const showServices = conventionConfig.convention.showServices;

/**
 * True if Catch 'em All game is available for this convention.
 */
export const showCatchEm = conventionConfig.convention.showCatchEm;

/**
 * URL for accessing the Catch 'em All game for this convention.
 */
export const catchEmUrl = conventionConfig.convention.catchEmUrl;

/**
 * URL leading to the Artist Alley detail page for this convention.
 */
export const artistAlleyUrl = conventionConfig.convention.artistAlleyUrl;

/**
 * True if dealer view shows attendee.
 */
export const dealerShowAttendee = conventionConfig.convention.dealerShowAttendee;

export const authIssuer = conventionConfig.auth.issuer;
export const authRedirect = conventionConfig.auth.redirect;
export const authClientId = conventionConfig.auth.clientId;
export const authScopes = conventionConfig.auth.scopes;
export const authSettingsUrl = conventionConfig.auth.settingsUrl;
