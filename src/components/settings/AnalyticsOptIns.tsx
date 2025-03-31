import React, { useMemo } from "react";
import Checkbox from "expo-checkbox";
import { noop } from "lodash";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { defaultSettings, useDataCache } from "@/context/DataCacheProvider";
import { Label } from "@/components/generic/atoms/Label";
import { Col } from "@/components/generic/containers/Col";
import { SettingContainer } from "./SettingContainer";

/**
 * Analytics opt-in section with a checkbox to allow analytics.
 */
export const AnalyticsOptIns = () => {
    const { t } = useTranslation("Settings");
    const { getCacheSync, saveCache } = useDataCache();
    const settings = useMemo(() => getCacheSync("settings", "settings")?.data ?? defaultSettings, [getCacheSync]);

    const analyticsEnabled = settings.analytics?.enabled ?? false;

    const setAnalytics = (enabled: boolean) => {
        const newSettings = {
            ...settings,
            analytics: { enabled }
        };
        saveCache("settings", "settings", newSettings);
    };

    const toggleDevMenu = (enabled: boolean) => {
        const newSettings = {
            ...settings,
            devMenu: enabled
        };
        saveCache("settings", "settings", newSettings);
    };

    return (
        <SettingContainer>
            <TouchableOpacity
                style={styles.container}
                onPress={() => setAnalytics(!analyticsEnabled)}
                onLongPress={() =>
                    Alert.alert(t("developer_settings_alert.title"), t("developer_settings_alert.body"), [
                        {
                            text: t("developer_settings_alert.cancel"),
                            onPress: noop,
                            style: "cancel"
                        },
                        {
                            text: t("developer_settings_alert.disable"),
                            onPress: () => toggleDevMenu(false),
                            style: "default"
                        },
                        {
                            text: t("developer_settings_alert.enable"),
                            onPress: () => toggleDevMenu(true),
                            style: "destructive"
                        }
                    ])
                }
                delayLongPress={1000}
            >
                <Col style={styles.column}>
                    <Label variant="bold">{t("allowAnalytics")}</Label>
                    <Label variant="narrow">{t("allowAnalyticsSubtitle")}</Label>
                </Col>

                <Checkbox value={analyticsEnabled} />
            </TouchableOpacity>
        </SettingContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    column: {
        flex: 1
    }
});
