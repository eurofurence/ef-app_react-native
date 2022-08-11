import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18next from "i18next";
import { noop, partial } from "lodash";
import moment from "moment";
import { initReactI18next } from "react-i18next";

import de from "./translations.de.json";
import en from "./translations.en.json";
import it from "./translations.it.json";
import nl from "./translations.nl.json";
import pl from "./translations.pl.json";
/**
 * Only to be used for moment's locale. When english is given without a
 * specified locale, use en-GB, as it presents in the euro-centric time format.
 * @param language The language to transform.
 */
export const localeForMoment = (language: string) => {
    // Change when only given as en.
    if (language.toLowerCase() === "en") return "en-gb";

    // Leave others unchanged.
    return language;
};

// Set for date times
moment.locale(localeForMoment(Localization.locale));

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
            moment.locale(localeForMoment(persisted ?? fallback));
            return callback(persisted ?? fallback);
        },
        cacheUserLanguage: async (lng: string) =>
            AsyncStorage.setItem(I18NEXT_LANGAGUE_KEY, lng)
                .then(() => logger("Saving langauge for next time", lng))
                .catch((e) => logger("Failed to save language", lng, e)),
    })
    .init({
        compatibilityJSON: "v3",
        fallbackLng: "en",
        initImmediate: true,
        defaultNS: "Home",
        resources: {
            en,
            nl,
            de,
            it,
            pl,
        },
        react: {
            useSuspense: false,
        },
    });

/**
 * Re-export i18next.
 */
export default i18next;
