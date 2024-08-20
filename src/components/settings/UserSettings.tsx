import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AnalyticsOptIns } from "./AnalyticsOptIns";
import { DeviceWarnings } from "./DeviceWarnings";
import { HiddenEvents } from "./HiddenEvents";
import { LanguagePicker } from "./LanguagePicker";
import { ThemePicker } from "./ThemePicker";
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
            <Section title={t("settingsSection")} icon="cog" />

            {/* Allow choosing theme. */}
            <ThemePicker />

            {/* Options for analytics and crash reporting. */}
            <AnalyticsOptIns />

            {/* Language selection mask. */}
            <LanguagePicker />

            {/* Hidden events functionality, undo. */}
            <HiddenEvents />

            {/* Device warning settings */}
            <DeviceWarnings />
        </View>
    );
};
