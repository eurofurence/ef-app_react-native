import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../../components/app/AppStyles";
import { CacheStats } from "../../components/app/settings/CacheStats";
import { DevButtons } from "../../components/app/settings/DevButtons";
import { RemoteMessages } from "../../components/app/settings/RemoteMessages";
import { ScheduledNotifications } from "../../components/app/settings/ScheduledNotifications";
import { TimeTravel } from "../../components/app/settings/TimeTravel";
import { UserSettings } from "../../components/app/settings/UserSettings";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAppSelector } from "../../store";

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
                        <CacheStats />
                        <TimeTravel />
                        <ScheduledNotifications />
                        <RemoteMessages />
                        <DevButtons />
                    </>
                )}
            </Floater>
        </ScrollView>
    );
};
