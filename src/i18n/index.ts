import * as Localization from "expo-localization";
import i18next, { LanguageDetectorModule } from "i18next";
import { noop } from "lodash";
import moment from "moment";
import { initReactI18next } from "react-i18next";

import en from "./translations.en.json";
import nl from "./translations.nl.json";
// Set for datetimes
moment.locale(Localization.locale);

i18next
    .use(initReactI18next)
    .use({
        type: "languageDetector",
        init: noop,
        detect: () => Localization.locale,
        cacheUserLanguage: Function.prototype,
    } as LanguageDetectorModule)
    .init({
        fallbackLng: "en",
        debug: true,
        defaultNS: "Home",
        resources: {
            en,
            nl,
        },
        react: {
            useSuspense: false,
        },
    });
export default i18next;
