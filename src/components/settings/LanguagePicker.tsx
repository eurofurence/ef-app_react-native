import { Picker } from "@react-native-picker/picker";
import { captureException } from "@sentry/react-native";
import { orderBy } from "lodash";
import { useTranslation } from "react-i18next";

import { SettingContainer } from "./SettingContainer";
import { useThemeColor } from "../../hooks/themes/useThemeHooks";
import { setMomentLocale, Translations } from "../../i18n";
import { Label } from "../generic/atoms/Label";

/**
 * Element of languages that the picker displays.
 */
type Language = {
    /**
     * Language code, must be one of our translations.
     */
    code: Translations;

    /**
     * Display name with flag code.
     */
    name: string;
};

/**
 * List of language codes and display names.
 */
const languages = orderBy(
    [
        { code: "en", name: "🇬🇧 English" },
        { code: "de", name: "🇩🇪 Deutsch" },
        { code: "nl", name: "🇳🇱 Nederlands" },
        { code: "it", name: "🇮🇹 Italiano" },
        { code: "pl", name: "🇵🇱 Polski" },
        { code: "da", name: "🇩🇰 Dansk" },
    ] as Language[],
    (value) => value.code,
    "asc",
);

/**
 * This component controls the language by directly injecting into the i18n
 * instance and changing the language there. The locale of moment is also
 * updated.
 * @constructor
 */
export const LanguagePicker = () => {
    const { t, i18n } = useTranslation("Settings");
    const style = useThemeColor("text");

    return (
        <SettingContainer>
            <Label variant={"bold"}>{t("changeLanguage")}</Label>
            <Label variant={"narrow"}>{t("currentLanguage")}</Label>
            <Picker<string>
                selectedValue={i18n.language}
                style={style}
                dropdownIconColor={style.color}
                prompt={t("changeLanguage")}
                onValueChange={(it: string) => {
                    i18n.changeLanguage(it).catch(captureException);
                    setMomentLocale(it);
                }}
            >
                {languages.map((it) => (
                    <Picker.Item label={it.name} value={it.code} key={it.code} />
                ))}
            </Picker>
        </SettingContainer>
    );
};
