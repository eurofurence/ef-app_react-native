import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { orderBy } from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { applyDefaultRegion } from "../../i18n";
import { useAppDispatch, useAppSelector } from "../../store";
import { setAnalytics } from "../../store/settings.slice";

type Language = {
    code: string;
    name: string;
};
const languages = orderBy(
    [
        { code: "en-GB", name: "🇬🇧 English" },
        { code: "de-DE", name: "🇩🇪 Deutsch" },
        { code: "nl-NL", name: "🇳🇱 Nederlands" },
    ] as Language[],
    (value) => value.code,
    "asc"
);
export const UserSettings = () => {
    const { t, i18n } = useTranslation("Settings");
    const dispatch = useAppDispatch();
    const analyticsEnabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);

    return (
        <View>
            <Section title={t("settingsSection")} icon={"cog"} />
            <TouchableOpacity style={{ marginVertical: 20, flexDirection: "row" }} onPress={() => dispatch(setAnalytics(!analyticsEnabled))}>
                <Label type={"regular"} style={{ flex: 1 }}>
                    {t("allowAnalytics")}
                </Label>
                <Checkbox value={analyticsEnabled} />
            </TouchableOpacity>
            <Label>{t("currentLanguage")}</Label>
            <Picker<string>
                selectedValue={i18n.language}
                prompt={t("changeLanguage")}
                onValueChange={(it) => {
                    i18n.changeLanguage(it);
                    moment.locale(it);
                }}
            >
                {languages.map((it) => (
                    <Picker.Item label={it.name} value={applyDefaultRegion(it.code)} key={applyDefaultRegion(it.code)} />
                ))}
            </Picker>
        </View>
    );
};
