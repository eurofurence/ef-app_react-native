import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Section } from "@/components/generic/atoms/Section";
import { Button } from "@/components/generic/containers/Button";
import { SettingContainer } from "./SettingContainer";
import { useDataCache } from "@/context/DataCacheProvider";

export const HiddenEvents = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "hidden_events" });
    const router = useRouter();
    const { getCacheSync, saveCache } = useDataCache();
    const settings = getCacheSync("settings", "settings")?.data ?? {
        cid: "",
        cacheVersion: "",
        lastSynchronised: "",
        state: {},
        lastViewTimes: {},
        hiddenEvents: []
    };

    const unhideAllEvents = () => {
        const newSettings = {
            ...settings,
            hiddenEvents: []
        };
        saveCache("settings", "settings", newSettings);
    };

    return (
        <SettingContainer>
            <Section title={t("title")} subtitle={t("subtitle")} icon="monitor-eye" />

            <Button containerStyle={styles.button} icon="folder-eye" onPress={unhideAllEvents}>
                {t("unhide_all")}
            </Button>
            <Button containerStyle={styles.button} icon="eye" onPress={() => router.push("/settings/reveal-hidden")}>
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