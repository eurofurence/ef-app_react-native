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
 * App base, non-API URLs are relative to this.
 */
export const appBase = packageData.convention.appBase;

/**
 * API base, API methods are under this URL.
 */
export const apiBase = packageData.convention.apiBase;
