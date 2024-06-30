export type Theme = {
    /**
     * Primary brand color.
     */
    primary: string;

    /**
     * Secondary "colorful" color.
     */
    secondary: string;

    /**
     * Background of element displayed within a screen.
     */
    background: string;

    /**
     * Lowest surface of the screen, i.e., the proper background color.
     */
    surface: string;

    /**
     * Opposite of background.
     */
    inverted: string;

    /**
     * Text color.
     */
    text: string;

    /**
     * Text color with emphasis.
     */
    important: string;

    /**
     Text color on inverted.
     */
    invText: string;

    /**
     * Text color with emphasis on inverted.
     */
    invImportant: string;

    /**
     * Warning background.
     */
    warning: string;

    /**
     * Notification color.
     */
    notification: string;

    /**
     * Pull towards black.
     */
    darken: string;

    /**
     * Pull towards light.
     */
    lighten: string;

    /**
     * Pull against background.
     */
    soften: string;

    /**
     * White.
     */
    white: string;

    /**
     * Background for super-sponsor badge.
     */
    superSponsor: string;

    /**
     * Background for sponsor badge.
     */
    sponsor: string;

    /**
     * Text on super-sponsor badge.
     */
    superSponsorText: string;

    /**
     * Text on sponsor badge.
     */
    sponsorText: string;

    /**
     * Map marker.
     */
    marker: string;
};

/**
 * Named color in a theme.
 */
export type ThemeColor = keyof Theme;

/**
 * All theme definitions.
 */
export const themes: Record<string, Theme> = {
    light: {
        primary: "#005953",
        secondary: "#3421bc",
        background: "#f7f7f7",
        surface: "#f0f0f0",
        inverted: "#040014",
        text: "#323034",
        important: "#000000",
        invText: "#fff7f0",
        invImportant: "#ffffff",
        warning: "#ee5e22",
        notification: "#d91c52",
        darken: "#04001440",
        lighten: "#f7f7f7a0",
        soften: "#040014a0",
        white: "#ffffff",
        superSponsor: "#5300ff",
        superSponsorText: "#fff7f0",
        sponsor: "#ffd700",
        sponsorText: "#323034",
        marker: "#ff2f66",
    },
    medium: {
        primary: "#005953",
        secondary: "#3421bc",
        background: "#989898",
        surface: "#b6b6b6",
        inverted: "#251c29",
        text: "#251c29",
        important: "#000000",
        invText: "#fff7f0",
        invImportant: "#ffffff",
        warning: "#ee5e22",
        notification: "#d91c52",
        darken: "#251c2940",
        lighten: "#8c8a8d80",
        soften: "#251c29a0",
        white: "#ffffff",
        superSponsor: "#5300ff",
        superSponsorText: "#fff7f0",
        sponsor: "#ffd700",
        sponsorText: "#323034",
        marker: "#ff2f66",
    },
    dark: {
        primary: "#69a3a2",
        secondary: "#917dff",
        background: "#212121",
        surface: "#000000",
        inverted: "#e0dedb",
        text: "#e0dedb",
        important: "#f1ede8",
        invText: "#131313",
        invImportant: "#000000",
        warning: "#ee5e22",
        notification: "#d91c52",
        darken: "#04001440",
        lighten: "#f7f7f780",
        soften: "#f7f7f7a0",
        white: "#ffffff",
        superSponsor: "#5300ff",
        superSponsorText: "#fff7f0",
        sponsor: "#ffd700",
        sponsorText: "#323034",
        marker: "#ff2f66",
    },
    requinard: {
        primary: "#fff100",
        secondary: "#dace00",
        background: "#2b2b2b",
        surface: "#414141",
        inverted: "#b0b0b0",
        text: "#e0dedb",
        important: "#f1ede8",
        invText: "#131313",
        invImportant: "#000000",
        warning: "#ee5e22",
        notification: "#d91c52",
        darken: "#04001440",
        lighten: "#f7f7f7a0",
        soften: "#f7f7f7a0",
        white: "#ffffff",
        superSponsor: "#5300ff",
        superSponsorText: "#fff7f0",
        sponsor: "#ffd700",
        sponsorText: "#323034",
        marker: "#ff2f66",
    },
    pazuzu: {
        primary: "#4b556c",
        secondary: "#b1c269",
        background: "#8c8a8d",
        surface: "#b2b1b1",
        inverted: "#251c29",
        text: "#251c29",
        important: "#000000",
        invText: "#fff7f0",
        invImportant: "#ffffff",
        warning: "#ee5e22",
        notification: "#d91c52",
        darken: "#251c2940",
        lighten: "#8c8a8d80",
        soften: "#251c29a0",
        white: "#ffffff",
        superSponsor: "#5300ff",
        superSponsorText: "#fff7f0",
        sponsor: "#ffd700",
        sponsorText: "#323034",
        marker: "#ff2f66",
    },
};

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
              .padStart(2, "0")
        : // Had alpha.
          color.substring(0, 7) +
          Math.floor(alpha * 255)
              .toString(16)
              .padStart(2, "0");

/**
 * Name of defined themes.
 */
export type ThemeName = keyof typeof themes;
