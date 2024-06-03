import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

import { AboutScreen } from "./AboutScreen";
import { ScreenAreas, ScreenAreasParams } from "./ScreenAreas";
import { DealerScreen, DealerScreenParams } from "./dealers/DealerScreen";
import { EventScreen } from "./events/EventScreen";
import { FeedbackScreen } from "./events/FeedbackScreen";
import { KnowledgeEntryScreen } from "./kb/KnowledgeEntryScreen";
import { KnowledgeGroupsScreen } from "./kb/KnowledgeGroupsScreen";
import { MapScreen } from "./maps/MapScreen";
import { PrivateMessageItemScreen } from "./pm/PrivateMessageItemScreen";
import { PrivateMessageListScreen } from "./pm/PrivateMessageListScreen";
import { SettingsScreen } from "./settings/SettingsScreen";
import { useTheme, useThemeName } from "../hooks/themes/useThemeHooks";
import { CommunicationRecord, RecordId } from "../store/eurofurence.types";

/**
 * Available routes.
 */
export type ScreenStartParamsList = {
    /**
     * Primary areas.
     */
    Areas: ScreenAreasParams;

    /**
     * Detail screen for events.
     */
    Event: {
        id: string;
    };

    EventFeedback: {
        id: string;
    };

    /**
     * Detail screen for dealer.
     */
    Dealer: DealerScreenParams;
    Settings: undefined;
    PrivateMessageList: undefined;
    PrivateMessageItem: {
        id: RecordId;
        message: CommunicationRecord;
    };
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
};

const ScreenStartNavigator = createStackNavigator<ScreenStartParamsList>();

/**
 * The properties to the screen as a component. This does not have navigator properties, as it
 * is the node initially providing the navigation container.
 */
export type ScreenStartProps = object;

export const ScreenStart: FC<ScreenStartProps> = React.memo(() => {
    // Get the theme type for status bar configuration.
    const theme = useTheme();
    const themeType = useThemeName();

    return (
        <View style={StyleSheet.absoluteFill}>
            <StatusBar backgroundColor={theme.background} style={themeType === "light" ? "dark" : "light"} />
            <ScreenStartNavigator.Navigator screenOptions={{ headerShown: false }}>
                <ScreenStartNavigator.Screen name="Areas" component={ScreenAreas} />
                <ScreenStartNavigator.Screen name="Event" component={EventScreen} />
                <ScreenStartNavigator.Screen name="Dealer" component={DealerScreen} />
                <ScreenStartNavigator.Screen name="Settings" component={SettingsScreen} />
                <ScreenStartNavigator.Screen name="PrivateMessageList" component={PrivateMessageListScreen} />
                <ScreenStartNavigator.Screen name="PrivateMessageItem" component={PrivateMessageItemScreen} />
                <ScreenStartNavigator.Screen name="KnowledgeGroups" component={KnowledgeGroupsScreen} />
                <ScreenStartNavigator.Screen name="KnowledgeEntry" component={KnowledgeEntryScreen} />
                <ScreenStartNavigator.Screen name="Map" component={MapScreen} />
                <ScreenStartNavigator.Screen name="About" component={AboutScreen} />
                <ScreenStartNavigator.Screen name="EventFeedback" component={FeedbackScreen} />
            </ScreenStartNavigator.Navigator>
        </View>
    );
});
