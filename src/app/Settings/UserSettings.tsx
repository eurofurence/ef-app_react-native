import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { capitalize, noop, orderBy } from "lodash";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Col } from "../../components/Containers/Col";
import { conName } from "../../configuration";
import { setMomentLocale, Translations } from "../../i18n";
import { captureException } from "../../sentryHelpers";
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from "../../store/authorization.slice";
import { setAnalytics, toggleDevMenu } from "../../store/settings.slice";
import { LoginForm } from "../MainMenu/PagerLogin";

type Language = {
    code: Translations;
    name: string;
};

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
    "asc"
);

const LoginSettings = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "login" });
    const auth = useAppSelector((state) => state.authorization);
    const dispatch = useAppDispatch();

    if (!auth.isLoggedIn) {
        return (
            <>
                <Label variant={"bold"}>{t("login")}</Label>
                <LoginForm />
            </>
        );
    }

    return (
        <>
            <Label variant={"bold"}>{t("logged_in_as", { username: capitalize(auth.username) })}</Label>
            <Label variant={"narrow"}>{t("login_description", { conName })}</Label>
            <Button icon="logout" onPress={() => dispatch(logout())} style={{ marginTop: 15 }}>
                {t("logout")}
            </Button>
        </>
    );
};

export const UserSettings = () => {
    const { t, i18n } = useTranslation("Settings");
    const dispatch = useAppDispatch();
    const analyticsEnabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);

    return (
        <View>
            <Section title={t("settingsSection")} icon={"cog"} />
            <SettingItem>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => dispatch(setAnalytics(!analyticsEnabled))}
                    onLongPress={() =>
                        Alert.alert(t("developer_settings_alert.title"), t("developer_settings_alert.body"), [
                            {
                                text: t("developer_settings_alert.cancel"),
                                onPress: noop,
                                style: "cancel",
                            },
                            {
                                text: t("developer_settings_alert.disable"),
                                onPress: () => dispatch(toggleDevMenu(false)),
                                style: "default",
                            },
                            {
                                text: t("developer_settings_alert.enable"),
                                onPress: () => dispatch(toggleDevMenu(true)),
                                style: "destructive",
                            },
                        ])
                    }
                    delayLongPress={1000}
                >
                    <Col style={{ flex: 1 }}>
                        <Label variant={"bold"}>{t("allowAnalytics")}</Label>
                        <Label variant={"narrow"}>{t("allowAnalyticsSubtitle")}</Label>
                    </Col>

                    <Checkbox value={analyticsEnabled} />
                </TouchableOpacity>
            </SettingItem>
            <SettingItem>
                <Label variant={"bold"}>{t("changeLanguage")}</Label>
                <Label variant={"narrow"}>{t("currentLanguage")}</Label>
                <Picker<string>
                    selectedValue={i18n.language}
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
            </SettingItem>
            <SettingItem>
                <LoginSettings />
            </SettingItem>
        </View>
    );
};

const SettingItem: FC = ({ children }) => <View style={{ marginVertical: 10 }}>{children}</View>;
