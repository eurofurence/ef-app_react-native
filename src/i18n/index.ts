import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18next from "i18next";
import { noop, partial } from "lodash";
import { initReactI18next } from "react-i18next";
import { format, Locale } from "date-fns";
import { da, de, enGB, it, nl, pl } from "date-fns/locale";
import { i18nDebug } from "@/configuration";

// Polyfill for Plural Rules
import "intl-pluralrules";

// Translation files
import daTranslations from "./translations.da.json";
import deTranslations from "./translations.de.json";
import enTranslations from "./translations.en.json";
import itTranslations from "./translations.it.json";
import nlTranslations from "./translations.nl.json";
import plTranslations from "./translations.pl.json";

/**
 * List of supported locales.
 */
export const supportedTranslations = ["en", "nl", "pl", "it", "da", "de"] as const;

/**
 * The translations we provide.
 */
export type Translation = (typeof supportedTranslations)[number];

/**
 * Map language codes to date-fns locales.
 */
const dateFnsLocales: Record<string, Locale> = {
    en: enGB,
    nl: nl,
    pl: pl,
    it: it,
    da: da,
    de: de,
};

/**
 * Finds the first user-selected supported locale, returns the language code.
 */
const firstSupportedLocale = () => Localization.getLocales().find(({ languageTag }) => supportedTranslations.includes(languageTag as Translation))?.languageCode ?? "en";

const logger = partial(console.log, "i18next");

const I18NEXT_LANGUAGE_KEY = "i18next";

/**
 * Initialized promise to the i18next translate function.
 */
export const i18t = i18next
    .use(initReactI18next)
    .use({
        type: "languageDetector",
        async: true,
        init: noop,
        detect: async (callback: (language: string) => void) => {
            // Get fallback and selected from localization and storage.
            const fallback = firstSupportedLocale();
            const persisted = await AsyncStorage.getItem(I18NEXT_LANGUAGE_KEY);

            // Log what was detected and stored.
            logger(`Detecting languages, saved: ${persisted}, fallback ${fallback}`);

            return callback(persisted ?? fallback);
        },
        cacheUserLanguage: async (lng: string) =>
            AsyncStorage.setItem(I18NEXT_LANGUAGE_KEY, lng)
                .then(i18nDebug ? () => logger("Saving language for next time", lng) : undefined)
                .catch((e) => logger("Failed to save language", lng, e)),
    })
    .init({
        fallbackLng: "en",
        initImmediate: true,
        defaultNS: "Home",
        resources: {
            en: enTranslations,
            nl: nlTranslations,
            de: deTranslations,
            it: itTranslations,
            pl: plTranslations,
            da: daTranslations,
        },
        interpolation: { escapeValue: false },
        react: {
            useSuspense: false,
        },
        parseMissingKeyHandler: (key, defaultValue) => {
            if (defaultValue === undefined) {
                console.warn("react-i18next", "Key not found.", key);
                return key;
            } else {
                return defaultValue;
            }
        },
    });

/**
 * Helper function to format dates using date-fns with locale support.
 */
export const formatDate = (date: Date | string, formatStr: string, language: Translation) => {
    return format(new Date(date), formatStr, { locale: dateFnsLocales[language] });
};

/**
 * Re-export i18next.
 */
export default i18next;
