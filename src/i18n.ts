import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
    fallbackLng: "en",
    debug: true,
    resources: {
        en: {
            translation: {
                hello: "Hello world",
                change: "Change language",
            },
        },
        sv: {
            translation: {
                hello: "Hej världen",
                change: "Byt språk",
            },
        },
        de: {
            translation: {
                hello: "Hallo Welt",
                change: "Sprache andern",
            },
        },
    },
});
export default i18next;
