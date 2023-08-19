import { CompositeScreenProps } from "@react-navigation/core";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, RefObject, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DealersTabsScreen, DealersTabsScreenParams } from "./Dealers/DealersTabsScreen";
import { EventsTabsScreen, EventsTabsScreenParams } from "./Events/EventsTabsScreen";
import { HomeScreen, ScreenHomeParams } from "./Home/HomeScreen";
import { MainMenu } from "./MainMenu/MainMenu";
import { ScreenStartParamsList } from "./ScreenStart";
import { TabsRef } from "../components/Containers/Tabs";
import { createTabNavigator, TabScreenProps } from "../components/Navigators/TabsNavigator";

/**
 * Available routes.
 */
export type ScreenAreasParamsList = {
    /**
     * Area home screen, should show announcements and personalized content.
     */
    Home: ScreenHomeParams;

    /**
     * Events list.
     */
    Events: EventsTabsScreenParams;

    /**
     * Dealers list.
     */
    Dealers: DealersTabsScreenParams;
};

/**
 * Create an instance of the tabs-navigator with the provided routes.
 */
export const AreasNavigator = createTabNavigator<ScreenAreasParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the areas.
 */
export type ScreenAreasParams = NavigatorScreenParams<ScreenAreasParamsList>;

/**
 * The properties to the screen as a component. Delegated parameters for the areas. TODO: Verify.
 */
export type ScreenAreasProps =
    // Route carrying from start screen at "Areas", navigation via own parameter list and parent.
    CompositeScreenProps<StackScreenProps<ScreenStartParamsList, "Areas">, TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>>;

export const ScreenAreas: FC<ScreenAreasProps> = React.memo(() => {
    const { t } = useTranslation("Menu");

    // Compute safe inset at the bottom and convert to style.
    const bottom = useSafeAreaInsets()?.bottom;
    const tabsStyle = useMemo(() => ({ paddingBottom: Math.max(bottom, 30) }), [bottom]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <AreasNavigator.Navigator tabsStyle={tabsStyle} textMore={t("more")} textLess={t("less")} more={(tabs: RefObject<TabsRef>) => <MainMenu tabs={tabs} />}>
                <AreasNavigator.Screen name="Home" options={{ title: t("home"), icon: "home" }} component={HomeScreen} />
                <AreasNavigator.Screen name="Events" options={{ title: t("events"), icon: "calendar" }} component={EventsTabsScreen} />
                <AreasNavigator.Screen name="Dealers" options={{ title: t("dealers"), icon: "cart-outline" }} component={DealersTabsScreen} />
            </AreasNavigator.Navigator>
        </View>
    );
});
