import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { useAppDispatch, useAppSelector } from "../../store";
import { toggleShowDeviceWarnings, toggleShowLanguageWarnings, toggleShowTimeZoneWarnings } from "../../store/auxiliary/slice";
import { Section } from "../generic/atoms/Section";
import { Button } from "../generic/containers/Button";
import { SettingContainer } from "./SettingContainer";

export const Warnings = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "device_warnings" });

    const deviceWarningsHidden = useAppSelector((state) => state.auxiliary.deviceWarningsHidden);
    const languageWarningsHidden = useAppSelector((state) => state.auxiliary.languageWarningsHidden);
    const timeZoneWarningsHidden = useAppSelector((state) => state.auxiliary.timeZoneWarningsHidden);
    const dispatch = useAppDispatch();

    return (
        <SettingContainer>
            <Section title={t("title")} subtitle={t("subtitle")} icon="monitor-eye" />

            <Button containerStyle={styles.button} icon={deviceWarningsHidden ? "eye" : "eye-off"} onPress={() => dispatch(toggleShowDeviceWarnings())}>
                {deviceWarningsHidden ? t("show_device_warnings") : t("hide_device_warnings")}
            </Button>

            <Button containerStyle={styles.button} icon={languageWarningsHidden ? "eye" : "eye-off"} onPress={() => dispatch(toggleShowLanguageWarnings())}>
                {languageWarningsHidden ? t("show_language_warnings") : t("hide_language_warnings")}
            </Button>
            <Button containerStyle={styles.button} icon={timeZoneWarningsHidden ? "eye" : "eye-off"} onPress={() => dispatch(toggleShowTimeZoneWarnings())}>
                {timeZoneWarningsHidden ? t("show_time_zone_warnings") : t("hide_time_zone_warnings")}
            </Button>
        </SettingContainer>
    );
};
const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
    },
});
