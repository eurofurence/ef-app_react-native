import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { About } from "./About";
import { AnnouncementItem, AnnouncementItemParams } from "./AnnouncementItem";
import { AreasRouter, AreasRouterParams } from "./AreasRouter";
import { Viewer, ViewerParams } from "./Viewer";
import { DealerItem, DealerItemParams } from "./dealers/DealerItem";
import { EventFeedback } from "./events/EventFeedback";
import { EventItem, EventItemParams } from "./events/EventItem";
import { KbItem } from "./kb/KbItem";
import { KbList } from "./kb/KbList";
import { Map } from "./maps/Map";
import { PmItem, PmItemParams } from "./pm/PmItem";
import { PmList } from "./pm/PmList";
import { RevealHidden } from "./settings/RevealHidden";
import { Settings } from "./settings/Settings";
import { useTheme, useThemeName } from "../hooks/themes/useThemeHooks";
import { RecordId } from "../store/eurofurence/types";

/**
 * Available routes.
 */
export type IndexRouterParamsList = {
    /**
     * Primary areas.
     */
    Areas: AreasRouterParams;
    Announcement: AnnouncementItemParams;
    Event: EventItemParams;
    Dealer: DealerItemParams;
    EventFeedback: { id: string };
    Settings: undefined;
    RevealHidden: undefined;
    PrivateMessageList: undefined;
    PrivateMessageItem: PmItemParams;
    KnowledgeGroups: object;
    KnowledgeEntry: {
        id: RecordId;
    };
    Map: {
        id: RecordId;
        entryId?: RecordId;
        linkId?: number;
    };
    About: undefined;
    Viewer: ViewerParams;
};

const Stack = createStackNavigator<IndexRouterParamsList>();

/**
 * The properties to the screen as a component. This does not have navigator properties, as it
 * is the node initially providing the navigation container.
 */
export type IndexRouterProps = object;

/**
 * This is the main router that starts on the primary screens (events, dealers, home) and allows pushing
 * child elements on the stack.
 */
export const IndexRouter: FC<IndexRouterProps> = () => {
    // Get the theme type for status bar configuration.
    const theme = useTheme();
    const themeType = useThemeName();

    return (
        <SafeAreaView style={StyleSheet.absoluteFill}>
            <StatusBar backgroundColor={theme.background} style={themeType === "light" ? "dark" : "light"} />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Areas" component={AreasRouter} />
                <Stack.Screen name="Announcement" component={AnnouncementItem} />
                <Stack.Screen name="Event" component={EventItem} />
                <Stack.Screen name="Dealer" component={DealerItem} />
                <Stack.Screen name="EventFeedback" component={EventFeedback} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="RevealHidden" component={RevealHidden} />
                <Stack.Screen name="PrivateMessageList" component={PmList} />
                <Stack.Screen name="PrivateMessageItem" component={PmItem} />
                <Stack.Screen name="KnowledgeGroups" component={KbList} />
                <Stack.Screen name="KnowledgeEntry" component={KbItem} />
                <Stack.Screen name="Map" component={Map} />
                <Stack.Screen name="About" component={About} />
                <Stack.Screen name="Viewer" component={Viewer} />
            </Stack.Navigator>
        </SafeAreaView>
    );
};
