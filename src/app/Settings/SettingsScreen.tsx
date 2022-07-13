import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { CacheStats } from "./CacheStats";
import { DevButtons } from "./DevButtons";
import { RemoteMessages } from "./RemoteMessages";
import { PlatformScheduledNotifications } from "./ScheduledNotifications";
import { TimeTravel } from "./TimeTravel";

export const SettingsScreen = () => {
    const top = useSafeAreaInsets()?.top;
    const headerStyle = useMemo(() => ({ paddingTop: 30 + top }), [top]);
    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>Settings</Header>
            <Scroller>
                <Section title={"Developer Settings"} icon={"bug"} />
                <Label mb={15}>You shouldn't touch these unless you know what you're doing.</Label>

                <CacheStats />
                <TimeTravel />
                <PlatformScheduledNotifications />
                <RemoteMessages />
                <DevButtons />
            </Scroller>
        </View>
    );
};
