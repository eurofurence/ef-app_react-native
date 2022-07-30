import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18next from "i18next";
import { noop, partial } from "lodash";
import moment from "moment";
import { initReactI18next } from "react-i18next";

import de from "./translations.de.json";
import en from "./translations.en.json";
import nl from "./translations.nl.json";

// Set for datetimes
moment.locale(Localization.locale);

const logger = partial(console.log, "i18next");

const I18NEXT_LANGAGUE_KEY = "i18next";

const defaultRegions: Record<string, string> = {
    en: "GB",
    de: "DE",
    nl: "NL",
};

const applyDefaultRegion = <T extends string | null | undefined>(language: T) => {
    if (typeof language !== "string") return language;
    if (language.includes("-")) return language;
    const normalized = language.toLowerCase().trim();
    const region = defaultRegions[normalized];
    return region ? `${language}-${region}` : language;
};

i18next
    .use(initReactI18next)
    .use({
        type: "languageDetector",
        async: true,
        init: noop,
        detect: async (callback: (language: string) => void) => {
            const fallback = Localization.locale.split("-")[0];
            const fallbackFull = applyDefaultRegion(fallback);

            const persisted = await AsyncStorage.getItem(I18NEXT_LANGAGUE_KEY);
            const persistedFull = applyDefaultRegion(persisted);

            logger(`Detecting languages, saved: ${persisted} (${persistedFull}), fallback ${fallback} (${fallbackFull})`);

            // Set moment locale from detection and invoke callback.
            moment.locale(persistedFull ?? fallbackFull);
            return callback(persistedFull ?? fallbackFull);
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
        },
        react: {
            useSuspense: false,
        },
    });
export default i18next;
