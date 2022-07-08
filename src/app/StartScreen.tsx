import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";

import { AreasScreen } from "./AreasScreen";
import { EventsDetailScreen } from "./Events/EventsDetailScreen";

const MainNavigator = createStackNavigator();

export const StartScreen = () => {
    return (
        <NavigationContainer>
            <View style={StyleSheet.absoluteFill}>
                <MainNavigator.Navigator screenOptions={{ headerShown: false }}>
                    <MainNavigator.Screen name="Default" component={AreasScreen} />
                    <MainNavigator.Screen name="Event" component={EventsDetailScreen} />
                </MainNavigator.Navigator>
            </View>
        </NavigationContainer>
    );
};
