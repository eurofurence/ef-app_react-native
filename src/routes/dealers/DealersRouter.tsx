import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { createMaterialTopTabNavigator, MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DealersAd, DealersAdParams } from "./DealersAd";
import { DealersAll, DealersAllParams } from "./DealersAll";
import { DealersRegular, DealersRegularParams } from "./DealersRegular";
import { useTabStyles } from "../../components/generic/nav/useTabStyles";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Available routes.
 */
export type DealersRouterParamsList = {
    All: DealersAllParams;
    Regular: DealersRegularParams;
    AD: DealersAdParams;
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
    const topInset = useSafeAreaInsets().top;

    // If the screens require too much performance we should set detach to true again.
    return (
        <View style={StyleSheet.absoluteFill}>
            <Tab.Navigator
                initialRouteName="All"
                initialLayout={{
                    width: Dimensions.get("window").width,
                }}
                screenOptions={{
                    tabBarStyle: { marginTop: topInset },
                }}
            >
                <Tab.Screen name="All" options={{ title: t("all"), tabBarLabelStyle: tabStyles.normal }} component={DealersAll} />
                <Tab.Screen name="Regular" options={{ title: t("regular"), tabBarLabelStyle: tabStyles.normal }} component={DealersRegular} />
                <Tab.Screen name="AD" options={{ title: t("after_dark"), tabBarLabelStyle: tabStyles.normal }} component={DealersAd} />
            </Tab.Navigator>
        </View>
    );
};
