import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { SettingContainer } from "./SettingContainer";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useAppDispatch } from "../../store";
import { unhideAllEvents } from "../../store/auxiliary/slice";
import { Section } from "../generic/atoms/Section";
import { Button } from "../generic/containers/Button";

export const HiddenEvents = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "hidden_events" });
    const navigation = useAppNavigation("Areas");
    const dispatch = useAppDispatch();

    return (
        <SettingContainer>
            <Section title={t("title")} subtitle={t("subtitle")} icon="monitor-eye" />

            <Button containerStyle={styles.button} icon="folder-eye" onPress={() => dispatch(unhideAllEvents())}>
                {t("unhide_all")}
            </Button>
            <Button containerStyle={styles.button} icon="eye" onPress={() => navigation.navigate("RevealHidden")}>
                {t("unhide_specific")}
            </Button>
        </SettingContainer>
    );
};
const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
    },
});
