export type Theme = {
  /**
   * Primary brand color.
   */
  primary: string

  /**
   * Secondary "colorful" color.
   */
  secondary: string

  /**
   * Background of element displayed within a screen.
   */
  background: string

  /**
   * Lowest surface of the screen, i.e., the proper background color.
   */
  surface: string

  /**
   * Opposite of background.
   */
  inverted: string

  /**
   * Text color.
   */
  text: string

  /**
   * Text color with emphasis.
   */
  important: string

  /**
   * Text color on inverted.
   */
  invText: string

  /**
   * Text color with emphasis on inverted.
   */
  invImportant: string

  /**
   * Warning background.
   */
  warning: string

  /**
   * Notification color.
   */
  notification: string

  /**
   * Pull towards black.
   */
  darken: string

  /**
   * Pull towards light.
   */
  lighten: string

  /**
   * Pull against background.
   */
  soften: string

  /**
   * White.
   */
  white: string

  /**
   * Background for super-sponsor badge.
   */
  superSponsor: string

  /**
   * Text on super-sponsor badge.
   */
  superSponsorText: string

  /**
   * Background for sponsor badge.
   */
  sponsor: string

  /**
   * Text on sponsor badge.
   */
  sponsorText: string

  /**
   * Background for staff badge.
   */
  staff: string

  /**
   * Text on staff badge.
   */
  staffText: string

  /**
   * Background for internal events.
   */
  internal: string

  /**
   * Map marker.
   */
  marker: string
}

/**
 * Named color in a theme.
 */
export type ThemeColor = keyof Theme

/**
 * All theme definitions.
 */
export const themes: Record<string, Theme> = {
  light: {
    primary: '#004742',
    secondary: '#196964',
    background: '#f7f7f7',
    surface: '#d7d7d7',
    inverted: '#002321',
    text: '#001a18',
    important: '#002321',
    invText: '#fff7f0',
    invImportant: '#ffffff',
    warning: '#ee5e22',
    notification: '#d91c52',
    darken: '#00111040',
    lighten: '#f7f7f7a0',
    soften: '#001110a0',
    white: '#ffffff',
    superSponsor: '#5300ff',
    superSponsorText: '#fff7f0',
    sponsor: '#ffd700',
    sponsorText: '#001a18',
    staff: '#ec661f',
    staffText: '#fff7f0',
    internal: '#ffc2a1',
    marker: '#ff2f66',
  },
  medium: {
    primary: '#003531',
    secondary: '#004742',
    background: '#669b97',
    surface: '#7faca9',
    inverted: '#001816',
    text: '#000e0d',
    important: '#001a18',
    invText: '#ccdddc',
    invImportant: '#e5eeed',
    warning: '#ee5e22',
    notification: '#d91c52',
    darken: '#00232140',
    lighten: '#99bcba80',
    soften: '#003531a0',
    white: '#efefef',
    superSponsor: '#5300ff',
    superSponsorText: '#fff7f0',
    sponsor: '#ffd700',
    sponsorText: '#001a18',
    staff: '#ec661f',
    staffText: '#fff7f0',
    internal: '#b97754',
    marker: '#ff2f66',
  },
  dark: {
    primary: '#00504a',
    secondary: '#7faca9',
    background: '#002321',
    surface: '#001110',
    inverted: '#e0dedb',
    text: '#e5eeed',
    important: '#f1ede8',
    invText: '#131313',
    invImportant: '#000808',
    warning: '#ee5e22',
    notification: '#b21542',
    darken: '#404f4f40',
    lighten: '#f7f7f780',
    soften: '#f7f7f7a0',
    white: '#ffffff',
    superSponsor: '#5300ff',
    superSponsorText: '#fff7f0',
    sponsor: '#ffd700',
    sponsorText: '#001a18',
    staff: '#ec661f',
    staffText: '#fff7f0',
    internal: '#895336ff',
    marker: '#ff2f66',
  },
  pazuzu: {
    primary: '#4b556c',
    secondary: '#b1c269',
    background: '#8c8a8d',
    surface: '#b2b1b1',
    inverted: '#251c29',
    text: '#251c29',
    important: '#000000',
    invText: '#fff7f0',
    invImportant: '#ffffff',
    warning: '#ee5e22',
    notification: '#d91c52',
    darken: '#251c2940',
    lighten: '#8c8a8d80',
    soften: '#251c29a0',
    white: '#ffffff',
    superSponsor: '#5300ff',
    superSponsorText: '#fff7f0',
    sponsor: '#ffd700',
    sponsorText: '#323034',
    staff: '#ec661f',
    staffText: '#fff7f0',
    internal: '#ffc2a1',
    marker: '#ff2f66',
  },
  adbergine: {
    primary: '#8b0a73',
    secondary: '#00cd5a',
    background: '#4a073e',
    surface: '#331143',
    inverted: '#cfa7e0',
    text: '#f2d4ff',
    important: '#f0f0f0',
    invText: '#440037',
    invImportant: '#700977',
    warning: '#ee5e22',
    notification: '#d91c52',
    darken: '#04001440',
    lighten: '#fccffd80',
    soften: '#ebaeffa0',
    white: '#ffffff',
    superSponsor: '#5300ff',
    superSponsorText: '#fff7f0',
    sponsor: '#ffd700',
    sponsorText: '#323034',
    staff: '#c25114',
    staffText: '#fff7f0',
    internal: '#9b4111',
    marker: '#ff2f66',
  },
}

/**
 * Adds or replaces alpha
 * @param color The original color.
 * @param alpha The alpha value between 0 and 1.
 */
export const withAlpha = (color: string, alpha: number) =>
  color.length === 7
    ? // Had no alpha.
      color +
      Math.floor(alpha * 255)
        .toString(16)
        .padStart(2, '0')
    : // Had alpha.
      color.substring(0, 7) +
      Math.floor(alpha * 255)
        .toString(16)
        .padStart(2, '0')

/**
 * Name of defined themes.
 */
export type ThemeName = keyof typeof themes
