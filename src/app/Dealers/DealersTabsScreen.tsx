import { CompositeScreenProps } from "@react-navigation/core";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DealersListAllScreen, DealersListAllScreenParams } from "./DealersListAllScreen";
import { DealersListByDayScreen, DealersListByDayScreenParams } from "./DealersListByDayScreen";
import { createPagesNavigator, PagesScreenProps } from "../../components/generic/nav/PagesNavigator";
import { TabScreenProps } from "../../components/generic/nav/TabsNavigator";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors } from "../../store/eurofurence.selectors";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";

/**
 * Available routes.
 */
export type DealersTabsScreenParamsList = {
    All: DealersListAllScreenParams;
    Mon: DealersListByDayScreenParams;
    Tue: DealersListByDayScreenParams;
    Wed: DealersListByDayScreenParams;
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

    // Compute the safe area.
    const top = useSafeAreaInsets()?.top;
    const pagesStyle = useMemo(() => ({ paddingTop: top }), [top]);

    // If the screens require too much performance we should set detach to true again.
    return (
        <DealersTabsScreenNavigator.Navigator pagesStyle={pagesStyle} initialRouteName="All">
            <DealersTabsScreenNavigator.Screen name="All" options={{ title: t("all") }} component={DealersListAllScreen} />
            <DealersTabsScreenNavigator.Screen name="Mon" options={{ title: mon, highlight: isMon }} component={DealersListByDayScreen} />
            <DealersTabsScreenNavigator.Screen name="Tue" options={{ title: tue, highlight: isTue }} component={DealersListByDayScreen} />
            <DealersTabsScreenNavigator.Screen name="Wed" options={{ title: wed, highlight: isWed }} component={DealersListByDayScreen} />
        </DealersTabsScreenNavigator.Navigator>
    );
};
