import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

import { useTheme, useThemeType } from "../context/Theme";
import { CommunicationRecord, RecordId } from "../store/eurofurence.types";
import { AboutScreen } from "./About";
import { ScreenEmptyParams } from "./Common/ScreenEmpty";
import { DealerScreen, DealerScreenParams } from "./Dealers/DealerScreen";
import { EventScreen } from "./Events/EventScreen";
import { KnowledgeEntryScreen } from "./Knowledge/KnowledgeEntryScreen";
import { KnowledgeGroupsScreen } from "./Knowledge/KnowledgeGroupsScreen";
import { MapScreen } from "./Maps/MapScreen";
import { PrivateMessageItemScreen } from "./PrivateMessages/PrivateMessageItemScreen";
import { PrivateMessageListScreen } from "./PrivateMessages/PrivateMessageListScreen";
import { ScreenAreas, ScreenAreasParams } from "./ScreenAreas";
import { SettingsScreen } from "./Settings/SettingsScreen";

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

    /**
     * Detail screen for dealer.
     */
    Dealer: DealerScreenParams;
    Settings: ScreenEmptyParams;
    PrivateMessageList: ScreenEmptyParams;
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
    const themeType = useThemeType();

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
            </ScreenStartNavigator.Navigator>
        </View>
    );
});
