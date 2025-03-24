import { useDataCache } from "@/context/DataCacheProvider";
import { ThemeName } from "@/context/Theme";
import { useTheme } from "@/hooks/themes/useThemeHooks";
import { ChoiceButtons } from "@/components/generic/atoms/ChoiceButtons";
import { SettingContainer } from "./SettingContainer";
import { Col } from "@/components/generic/containers/Col";
import { Label } from "@/components/generic/atoms/Label";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

type ThemeChoice = ThemeName | "system";

const usableThemes: ThemeChoice[] = ["light", "dark", "system"];

export const ThemePicker = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "theme" });
    const { getCacheSync, saveCache } = useDataCache();
    const settings = getCacheSync("settings", "settings")?.data ?? {
        cid: "",
        cacheVersion: "",
        lastSynchronised: "",
        state: {},
        lastViewTimes: {},
        theme: undefined
    };

    // Get the current theme setting (not the effective theme)
    const currentThemeSetting = settings.theme;

    const setChoice = (choice: ThemeChoice) => {
        const newSettings = {
            ...settings,
            theme: choice === "system" ? undefined : choice,
        };
        saveCache("settings", "settings", newSettings);
    };

    return (
        <SettingContainer>
            <Col type="stretch">
                <Label variant="bold">{t("title")}</Label>
                <Label variant="narrow">{t("description")}</Label>
                <ChoiceButtons
                    style={styles.selector}
                    choices={usableThemes}
                    choice={currentThemeSetting === undefined ? "system" : currentThemeSetting}
                    setChoice={setChoice}
                    getLabel={(choice) => t(choice)}
                />
            </Col>
        </SettingContainer>
    );
};

const styles = StyleSheet.create({
    selector: {
        marginTop: 16,
    },
}); 