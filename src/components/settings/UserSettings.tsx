import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AnalyticsOptIns } from "./AnalyticsOptIns";
import { DeviceWarnings } from "./DeviceWarnings";
import { HiddenEvents } from "./HiddenEvents";
import { LanguagePicker } from "./LanguagePicker";
import { SettingContainer } from "./SettingContainer";
import { ThemePicker } from "./ThemePicker";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { Section } from "../generic/atoms/Section";
import { Button } from "../generic/containers/Button";

/**
 * User settings section of the settings screen.
 * @constructor
 */
export const UserSettings = () => {
    const { t } = useTranslation("Settings");
    const navigation = useAppNavigation("Areas");

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

            {/* About us section. */}
            <SettingContainer>
                <Button icon="cellphone-information" onPress={() => navigation.navigate("About")} outline>
                    {t("about")}
                </Button>
            </SettingContainer>

            {/* Hidden events functionality, undo. */}
            <HiddenEvents />

            {/* Device warning settings */}
            <DeviceWarnings />
        </View>
    );
};
