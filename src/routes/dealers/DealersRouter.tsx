import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { createMaterialTopTabNavigator, MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { Icon } from "../../components/generic/atoms/Icon";
import { useTabStyles } from "../../components/generic/nav/useTabStyles";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";
import { DealersAd, DealersAdParams } from "./DealersAd";
import { DealersAll, DealersAllParams } from "./DealersAll";
import { DealersAlpha, DealersAlphaParams } from "./DealersAlpha";
import { DealersRegular, DealersRegularParams } from "./DealersRegular";
import { PersonalDealers, PersonalDealersParams } from "./PersonalDealers";

/**
 * Available routes.
 */
export type DealersRouterParamsList = {
    All: DealersAllParams;
    Personal: PersonalDealersParams;
    Regular: DealersRegularParams;
    AD: DealersAdParams;
    Alpha: DealersAlphaParams;
};

/**
 * Create an instance of the top tabs with the provided routes.
 */
const Tab = createMaterialTopTabNavigator<DealersRouterParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the days. TODO: Verify.
 */
export type DealersRouterParams = NavigatorScreenParams<DealersRouterParamsList>;

/**
 * The properties to the screen as a component.
 */
export type DealersRouterProps =
    // Route carrying from area screen at "Dealers", own navigation via own parameter list.
    CompositeScreenProps<
        BottomTabScreenProps<AreasRouterParamsList, "Dealers">,
        MaterialTopTabScreenProps<DealersRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

/**
 * Controls and provides routing to dealer lists. Dealer items are pushed via the index router.
 * @constructor
 */
export const DealersRouter: FC<DealersRouterProps> = () => {
    const { t } = useTranslation("Dealers");

    // // Get common tab styles.
    const tabStyles = useTabStyles();

    // Get window dimensions and use it to prevent initial shrinkage on the screens.
    const dimensions = useWindowDimensions();
    const layout = useMemo(() => ({ width: dimensions.width, height: dimensions.height }), [dimensions.height, dimensions.width]);
    const scene = useMemo(() => ({ width: dimensions.width, minHeight: dimensions.height - 200 }), [dimensions.height, dimensions.width]);

    const defaultScreens = useMemo(
        () => [
            <Tab.Screen
                key="personal"
                name="Personal"
                options={{
                    title: t("favorites_title"),
                    tabBarShowLabel: false,
                    tabBarShowIcon: true,
                    tabBarIcon: ({ color }) => <Icon size={20} color={color} name="calendar-heart" />,
                    tabBarLabelStyle: tabStyles.normal,
                }}
                component={PersonalDealers}
            />,
            <Tab.Screen key="all" name="All" options={{ title: t("all"), tabBarLabelStyle: tabStyles.normal }} component={DealersAll} />,
            <Tab.Screen key="regular" name="Regular" options={{ title: t("regular"), tabBarLabelStyle: tabStyles.normal }} component={DealersRegular} />,
            <Tab.Screen key="ad" name="AD" options={{ title: t("after_dark"), tabBarLabelStyle: tabStyles.normal }} component={DealersAd} />,
            <Tab.Screen key="alpha" name="Alpha" options={{ title: t("alphabetical"), tabBarLabelStyle: tabStyles.normal }} component={DealersAlpha} />,
        ],
        [t, tabStyles.normal],
    );

    // If the screens require too much performance we should set detach to true again.
    return (
        <View style={StyleSheet.absoluteFill}>
            <Tab.Navigator initialRouteName="All" initialLayout={layout} sceneContainerStyle={scene}>
                {defaultScreens}
            </Tab.Navigator>
        </View>
    );
};
