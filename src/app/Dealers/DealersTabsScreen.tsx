import { CompositeScreenProps } from "@react-navigation/core";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DealersListAllScreen, DealersListAllScreenParams } from "./DealersListAllScreen";
import { DealersListByDayScreen, DealersListByDayScreenParams } from "./DealersListByDayScreen";
import { createPagesNavigator, PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors } from "../../store/eurofurence.selectors";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";

/**
 * Available routes.
 */
export type DealersTabsScreenParamsList = {
    All: DealersListAllScreenParams;
    Thu: DealersListByDayScreenParams;
    Fri: DealersListByDayScreenParams;
    Sat: DealersListByDayScreenParams;
};

/**
 * Create an instance of the pages-navigator with the provided routes.
 */
const DealersTabsScreenNavigator = createPagesNavigator<DealersTabsScreenParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the days. TODO: Verify.
 */
export type DealersTabsScreenParams = NavigatorScreenParams<DealersTabsScreenParamsList>;

/**
 * The properties to the screen as a component.
 */
export type DealersTabsScreenProps =
    // Route carrying from area screen at "Dealers", own navigation via own parameter list.
    CompositeScreenProps<
        TabScreenProps<ScreenAreasParamsList, "Dealers">,
        PagesScreenProps<DealersTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

export const DealersTabsScreen: FC<DealersTabsScreenProps> = () => {
    const { t } = useTranslation("Dealers");
    const [now] = useNow();

    // Use days to resolve actual dates.
    const days = useAppSelector(eventDaysSelectors.selectAll);

    // Formatted names.
    const { thu, fri, sat } = useMemo(
        () => ({
            thu: moment().day(4).format("ddd"),
            fri: moment().day(5).format("ddd"),
            sat: moment().day(6).format("ddd"),
        }),
        [t],
    );

    // Returns the flags if this is the current day.
    const { isThu, isFri, isSat } = useMemo(() => {
        const thuDate = days.map((day) => moment(day.Date)).find((moment) => moment.day() === 4);
        const friDate = days.map((day) => moment(day.Date)).find((moment) => moment.day() === 5);
        const satDate = days.map((day) => moment(day.Date)).find((moment) => moment.day() === 6);

        return {
            isThu: thuDate?.isSame(now, "day") ?? false,
            isFri: friDate?.isSame(now, "day") ?? false,
            isSat: satDate?.isSame(now, "day") ?? false,
        };
    }, [now]);

    // Compute the safe area.
    const top = useSafeAreaInsets()?.top;
    const pagesStyle = useMemo(() => ({ paddingTop: top }), [top]);

    // If the screens require too much performance we should set detach to true again.
    return (
        <DealersTabsScreenNavigator.Navigator pagesStyle={pagesStyle} initialRouteName="All">
            <DealersTabsScreenNavigator.Screen name="All" options={{ title: t("all") }} component={DealersListAllScreen} />
            <DealersTabsScreenNavigator.Screen name="Thu" options={{ title: thu, highlight: isThu }} component={DealersListByDayScreen} />
            <DealersTabsScreenNavigator.Screen name="Fri" options={{ title: fri, highlight: isFri }} component={DealersListByDayScreen} />
            <DealersTabsScreenNavigator.Screen name="Sat" options={{ title: sat, highlight: isSat }} component={DealersListByDayScreen} />
        </DealersTabsScreenNavigator.Navigator>
    );
};
