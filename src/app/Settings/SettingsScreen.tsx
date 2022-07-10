import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Scroller } from "../../components/Containers/Scroller";
import { RemoteMessages } from "./RemoteMessages";
import { PlatformScheduledNotifications } from "./ScheduledNotifications";
import { TimeTravel } from "./TimeTravel";

export const SettingsScreen = () => {
    const top = useSafeAreaInsets()?.top;
    const headerStyle = useMemo(() => ({ paddingTop: 30 + top }), [top]);
    return (
        <Scroller>
            <Section style={headerStyle} title={"Developer Settings"} icon={"bug"} />
            <Label mb={15}>You shouldn't touch these unless you know what you're doing.</Label>

            <TimeTravel />

            <PlatformScheduledNotifications />

            <RemoteMessages />
        </Scroller>
    );
};
