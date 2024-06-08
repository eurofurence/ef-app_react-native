import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../../components/AppStyles";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { CacheStats } from "../../components/settings/CacheStats";
import { DevButtons } from "../../components/settings/DevButtons";
import { RemoteMessages } from "../../components/settings/RemoteMessages";
import { ScheduledNotifications } from "../../components/settings/ScheduledNotifications";
import { TimeTravel } from "../../components/settings/TimeTravel";
import { UserSettings } from "../../components/settings/UserSettings";
import { useAppSelector } from "../../store";

export const Settings = () => {
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
