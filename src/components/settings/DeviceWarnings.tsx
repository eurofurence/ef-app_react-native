import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { SettingContainer } from "./SettingContainer";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleShowDeviceWarnings } from "../../store/auxiliary/slice";
import { Section } from "../generic/atoms/Section";
import { Button } from "../generic/containers/Button";

export const DeviceWarnings = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "device_warnings" });

    const warningsHidden = useAppSelector((state) => state.auxiliary.deviceWarningsHidden);
    const dispatch = useAppDispatch();

    return (
        <SettingContainer>
            <Section title={t("title")} subtitle={t("subtitle")} icon="monitor-eye" />

            <Button containerStyle={styles.button} icon={warningsHidden ? "eye" : "eye-off"} onPress={() => dispatch(toggleShowDeviceWarnings())}>
                {warningsHidden ? t("show_device_warnings") : t("hide_device_warnings")}
            </Button>
        </SettingContainer>
    );
};
const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
    },
});
