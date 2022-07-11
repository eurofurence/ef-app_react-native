import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

import { ScreenEmpty, ScreenEmptyParams } from "./Common/ScreenEmpty";
import { EventScreen, EventScreenParams } from "./Events/EventScreen";
import { PrivateMessageItemParams, PrivateMessageItemScreen } from "./PrivateMessages/PrivateMessageItemScreen";
import { PrivateMessageListScreen } from "./PrivateMessages/PrivateMessageListScreen";
import { ScreenAreas, ScreenAreasParams } from "./ScreenAreas";
import { SettingsScreen } from "./Settings/SettingsScreen";

/**
 * Available routes.
 */
export type ScreenStartNavigatorParamsList = {
    /**
     * Primary areas.
     */
    Areas: ScreenAreasParams;

    /**
     * Detail screen for events.
     */
    Event: EventScreenParams;

    /**
     * About page.
     */
    About: ScreenEmptyParams;

    Settings: ScreenEmptyParams;
    PrivateMessageList: ScreenEmptyParams;
    PrivateMessageItem: PrivateMessageItemParams;
};

const ScreenStartNavigator = createStackNavigator<ScreenStartNavigatorParamsList>();

/**
 * The properties to the screen as a component.
 */
export type ScreenStartProps = object;

export const ScreenStart: FC<ScreenStartProps> = () => {
    return (
        <NavigationContainer>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "green" }]}>
                <ScreenStartNavigator.Navigator screenOptions={{ headerShown: false }}>
                    <ScreenStartNavigator.Screen name="Areas" component={ScreenAreas} />
                    <ScreenStartNavigator.Screen name="Event" component={EventScreen} />
                    <ScreenStartNavigator.Screen name="About" component={ScreenEmpty} />
                    <ScreenStartNavigator.Screen name="Settings" component={SettingsScreen} />
                    <ScreenStartNavigator.Screen name="PrivateMessageList" component={PrivateMessageListScreen} />
                    <ScreenStartNavigator.Screen name="PrivateMessageItem" component={PrivateMessageItemScreen} />
                </ScreenStartNavigator.Navigator>
            </View>
        </NavigationContainer>
    );
};
