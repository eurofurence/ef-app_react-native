import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Section } from "../../components/Atoms/Section";
import { Floater } from "../../components/Containers/Floater";
import { Header } from "../../components/Containers/Header";
import { useAppSelector } from "../../store";
import { appStyles } from "../AppStyles";
import { CacheStats } from "./CacheStats";
import { DevButtons } from "./DevButtons";
import { RemoteMessages } from "./RemoteMessages";
import { PlatformScheduledNotifications } from "./ScheduledNotifications";
import { TimeTravel } from "./TimeTravel";
import { UserSettings } from "./UserSettings";

export const SettingsScreen = () => {
    const { t } = useTranslation("Settings");
    const safe = useSafeAreaInsets();
    const showDevMenu = useAppSelector((state): boolean => state.settingsSlice.showDevMenu ?? false);

    return (
        <ScrollView style={[appStyles.abs, safe]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{t("header")}</Header>
            <Floater contentStyle={appStyles.trailer}>
                <UserSettings />

                {showDevMenu && (
                    <>
                        <Section title={t("developer_settings.title")} subtitle={t("developer_settings.subtitle")} icon={"bug"} />

                        <CacheStats />
                        <TimeTravel />
                        <PlatformScheduledNotifications />
                        <RemoteMessages />
                        <DevButtons />
                    </>
                )}
            </Floater>
        </ScrollView>
    );
};
