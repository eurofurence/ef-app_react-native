import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
import { UserSettings } from "./UserSettings";

export const SettingsScreen = () => {
    const safe = useSafeAreaInsets();

    return (
        <ScrollView stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll style={safe}>
            <Header>Settings</Header>
            <View style={{ paddingHorizontal: 20 }}>
                <UserSettings />
                <Section title={"Developer Settings"} icon={"bug"} />
                <Label mb={15}>You shouldn't touch these unless you know what you're doing.</Label>

                <CacheStats />
                <TimeTravel />
                <PlatformScheduledNotifications />
                <RemoteMessages />
                <DevButtons />
            </View>
        </ScrollView>
    );
};
