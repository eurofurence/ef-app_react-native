import * as Localization from "expo-localization";
import i18next from "i18next";
import { noop } from "lodash";
import moment from "moment";
import { initReactI18next } from "react-i18next";

// Set for datetimes
moment.locale(Localization.locale);

i18next
    .use(initReactI18next)
    .use({
        type: "languageDetector",
        init: noop,
        detect: () => Localization.locale,
        cacheUserLanguage: Function.prototype,
    })
    .init({
        fallbackLng: "en",
        debug: true,
        resources: {
            en: {
                translation: {
                    hello: "Hello world",
                    change: "Change language",
                },
                Home: {
                    announcementsTitle_zero: "There are no announcements.",
                    announcementsTitle_one: "There is {{ count }} announcements.",
                    announcementsTitle_other: "There are {{ count }} announcements.",
                    eventsTitle_zero: "There are no events.",
                    eventsTitle_one: "We have retrieved {{ count }} event.",
                    eventsTitle_other: "We have retrieved {{ count }} events.",
                },
                Events: {
                    when: "{{ day }}, {{ start }} until {{ finish }}.",
                },
            },
            nl: {
                translation: {
                    hello: "Hallo Welt",
                    change: "Sprache andern",
                },
                Home: {
                    announcementsTitle_zero: "Er zijn geen aankondigingen.",
                    announcementsTitle_one: "Er is {{ count }} aankondiging.",
                    announcementsTitle_other: "Er zijn {{ count }} aankondigingen.",
                    eventsTitle_zero: "Er zijn geen events.",
                    eventsTitle_one: "We vonden {{ count }} event.",
                    eventsTitle_other: "We hebben {{ count }} events gevondens.",
                },
                Events: {
                    when: "{{ day }}, van {{ start }} tot {{ finish }}.",
                },
            },
        },
        react: {
            useSuspense: false,
        },
    });
export default i18next;
