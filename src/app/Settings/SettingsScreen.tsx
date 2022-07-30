import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Section } from "../../components/Atoms/Section";
import { Header } from "../../components/Containers/Header";
import { CacheStats } from "./CacheStats";
import { DevButtons } from "./DevButtons";
import { RemoteMessages } from "./RemoteMessages";
import { PlatformScheduledNotifications } from "./ScheduledNotifications";
import { TimeTravel } from "./TimeTravel";
import { UserSettings } from "./UserSettings";

export const SettingsScreen = () => {
    const { t } = useTranslation("Settings");
    const safe = useSafeAreaInsets();

    return (
        <ScrollView stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll style={safe}>
            <Header>{t("header")}</Header>
            <View style={{ paddingHorizontal: 20 }}>
                <UserSettings />
                <Section title={t("developer_settings.title")} subtitle={t("developer_settings.subtitle")} icon={"bug"} />

                <CacheStats />
                <TimeTravel />
                <PlatformScheduledNotifications />
                <RemoteMessages />
                <DevButtons />
            </View>
        </ScrollView>
    );
};
