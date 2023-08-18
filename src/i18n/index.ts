import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18next from "i18next";
import { noop, partial } from "lodash";
import moment from "moment";
import { initReactI18next } from "react-i18next";
import { match, P } from "ts-pattern";

// Polyfill for Plural Rules
import "intl-pluralrules";

// Translation files
import da from "./translations.da.json";
import de from "./translations.de.json";
import en from "./translations.en.json";
import it from "./translations.it.json";
import nl from "./translations.nl.json";
import pl from "./translations.pl.json";

// Moment Locale
import "moment/locale/pl";
import "moment/locale/it";
import "moment/locale/da";
import "moment/locale/de";
import "moment/locale/en-gb";
import "moment/locale/nl";

/**
 * The translations we provide.
 */
export type Translations = "en" | "nl" | "pl" | "it" | "da" | "de";

/**
 * Set the locale in a managed way.
 *
 * Provided translations resolve. English is set to en-gb and all other values are always en-gb
 */
export const setMomentLocale = (language: Translations | string) =>
    match(language)
        .with("it", "nl", "da", "de", "pl", (it) => moment.locale(it))
        .with("en", () => moment.locale("en-gb"))
        .with(P.string, () => moment.locale("en-gb"))
        .exhaustive();

setMomentLocale(Localization.locale);

const logger = partial(console.log, "i18next");

const I18NEXT_LANGAGUE_KEY = "i18next";

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
            const fallback = Localization.locale.split("-")[0];
            const persisted = await AsyncStorage.getItem(I18NEXT_LANGAGUE_KEY);

            // Log what was detected and stored.
            logger(`Detecting languages, saved: ${persisted}, fallback ${fallback}`);

            // Set moment locale with applied reasonable defaults, run callback with actual.
            setMomentLocale(persisted ?? fallback);
            return callback(persisted ?? fallback);
        },
        cacheUserLanguage: async (lng: string) =>
            AsyncStorage.setItem(I18NEXT_LANGAGUE_KEY, lng)
                .then(() => logger("Saving langauge for next time", lng))
                .catch((e) => logger("Failed to save language", lng, e)),
    })
    .init({
        fallbackLng: "en",
        initImmediate: true,
        defaultNS: "Home",
        resources: {
            en,
            nl,
            de,
            it,
            pl,
            da,
        },
        interpolation: { escapeValue: false },
        react: {
            useSuspense: false,
        },
        parseMissingKeyHandler: (key) => {
            console.warn("react-i18next", "Key not found.", key);
            return key;
        },
    });

/**
 * Re-export i18next.
 */
export default i18next;
