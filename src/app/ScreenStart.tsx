import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

import { ScreenEmpty, ScreenEmptyParams } from "./Common/ScreenEmpty";
import { ScreenEvent, ScreenEventsParams } from "./Events/ScreenEvent";
import { ScreenAreas, ScreenAreasParams } from "./ScreenAreas";

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
    Event: ScreenEventsParams;

    /**
     * About page.
     */
    About: ScreenEmptyParams;
};
const StartNavigator = createStackNavigator<ScreenStartNavigatorParamsList>();

/**
 * The properties to the screen as a component.
 */
export type ScreenStartProps = object;

export const ScreenStart: FC<ScreenStartProps> = () => {
    return (
        <NavigationContainer>
            <View style={StyleSheet.absoluteFill}>
                <StartNavigator.Navigator screenOptions={{ headerShown: false }}>
                    <StartNavigator.Screen name="Areas" component={ScreenAreas} />
                    <StartNavigator.Screen name="Event" component={ScreenEvent} />
                    <StartNavigator.Screen name="About" component={ScreenEmpty} />
                </StartNavigator.Navigator>
            </View>
        </NavigationContainer>
    );
};
