import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AnalyticsOptIns } from "./AnalyticsOptIns";
import { LanguagePicker } from "./LanguagePicker";
import { LoginFormOrDisplay } from "./LoginFormOrDisplay";
import { ThemePicker } from "./ThemePicker";
import { showLogin } from "../../configuration";
import { Section } from "../generic/atoms/Section";

/**
 * User settings section of the settings screen.
 * @constructor
 */
export const UserSettings = () => {
    const { t } = useTranslation("Settings");

    return (
        <View>
            {/* User visible settings, title. */}
            <Section title={t("settingsSection")} icon={"cog"} />

            {/* Allow choosing theme. */}
            <ThemePicker />

            {/* Options for analytics and crash reporting. */}
            <AnalyticsOptIns />

            {/* Language selection mask. */}
            <LanguagePicker />

            {/* Login mask, conditionally available when defined in PLC. */}
            {!showLogin ? null : <LoginFormOrDisplay />}
        </View>
    );
};