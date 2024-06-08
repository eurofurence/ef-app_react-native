import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { createMaterialTopTabNavigator, MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DealersAll, DealersAllParams } from "./DealersAll";
import { DealersByDay, DealersByDayParams } from "./DealersByDay";
import { useTabStyles } from "../../components/generic/nav/useTabStyles";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors } from "../../store/eurofurence.selectors";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Available routes.
 */
export type DealersRouterParamsList = {
    All: DealersAllParams;
    Mon: DealersByDayParams;
    Tue: DealersByDayParams;
    Wed: DealersByDayParams;
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
    const now = useNow();

    // Use days to resolve actual dates.
    const days = useAppSelector(eventDaysSelectors.selectAll);

    // Formatted names.
    const { mon, tue, wed } = useMemo(
        () => ({
            mon: moment().day(1).format("ddd"),
            tue: moment().day(2).format("ddd"),
            wed: moment().day(3).format("ddd"),
        }),
        [t],
    );

    // Returns the flags if this is the current day.
    const { isMon, isTue, isWed } = useMemo(() => {
        const monDate = days.find((day) => day.dayOfWeek === 1);
        const tueDate = days.find((day) => day.dayOfWeek === 2);
        const wedDate = days.find((day) => day.dayOfWeek === 3);

        return {
            isMon: monDate && moment(monDate.Date).isSame(now, "day"),
            isTue: tueDate && moment(tueDate.Date).isSame(now, "day"),
            isWed: wedDate && moment(wedDate.Date).isSame(now, "day"),
        };
    }, [now]);

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
                <Tab.Screen name="Mon" options={{ title: mon, tabBarLabelStyle: isMon ? tabStyles.highlight : tabStyles.normal }} component={DealersByDay} />
                <Tab.Screen name="Tue" options={{ title: tue, tabBarLabelStyle: isTue ? tabStyles.highlight : tabStyles.normal }} component={DealersByDay} />
                <Tab.Screen name="Wed" options={{ title: wed, tabBarLabelStyle: isWed ? tabStyles.highlight : tabStyles.normal }} component={DealersByDay} />
            </Tab.Navigator>
        </View>
    );
};
