import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

import { useThemeType } from "../context/Theme";
import { useNavigationStatePersistence } from "../hooks/useNavigationStatePersistence";
import { ScreenEmpty, ScreenEmptyParams } from "./Common/ScreenEmpty";
import { DealerScreen, DealerScreenParams } from "./Dealers/DealerScreen";
import { EventScreen, EventScreenParams } from "./Events/EventScreen";
import { MapScreen, MapScreenParams } from "./Maps/MapScreen";
import { PrivateMessageItemParams, PrivateMessageItemScreen } from "./PrivateMessages/PrivateMessageItemScreen";
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
    Event: EventScreenParams;

    /**
     * Detail screen for dealer.
     */
    Dealer: DealerScreenParams;

    /**
     * About page.
     */
    About: ScreenEmptyParams;

    Settings: ScreenEmptyParams;
    PrivateMessageList: ScreenEmptyParams;
    PrivateMessageItem: PrivateMessageItemParams;
    Map: MapScreenParams;
};

const ScreenStartNavigator = createStackNavigator<ScreenStartParamsList>();

/**
 * The properties to the screen as a component. This does not have navigator properties, as it
 * is the node initially providing the navigation container.
 */
export type ScreenStartProps = object;

export const ScreenStart: FC<ScreenStartProps> = () => {
    // Get the theme type for status bar configuration.
    const themeType = useThemeType();

    // Get navigation state from persistence.
    const [isReady, initialState, onStateChange] = useNavigationStatePersistence();

    // If not yet loaded, skip rendering.
    if (!isReady) {
        return null;
    }

    return (
        <NavigationContainer initialState={initialState} onStateChange={onStateChange}>
            <StatusBar style={themeType === "light" ? "dark" : "light"} />

            <View style={[StyleSheet.absoluteFill, { backgroundColor: "green" }]}>
                <ScreenStartNavigator.Navigator screenOptions={{ headerShown: false }}>
                    <ScreenStartNavigator.Screen name="Areas" component={ScreenAreas} />
                    <ScreenStartNavigator.Screen name="Event" component={EventScreen} />
                    <ScreenStartNavigator.Screen name="Dealer" component={DealerScreen} />
                    <ScreenStartNavigator.Screen name="About" component={ScreenEmpty} />
                    <ScreenStartNavigator.Screen name="Settings" component={SettingsScreen} />
                    <ScreenStartNavigator.Screen name="PrivateMessageList" component={PrivateMessageListScreen} />
                    <ScreenStartNavigator.Screen name="PrivateMessageItem" component={PrivateMessageItemScreen} />
                    <ScreenStartNavigator.Screen name="Map" component={MapScreen} />
                </ScreenStartNavigator.Navigator>
            </View>
        </NavigationContainer>
    );
};
