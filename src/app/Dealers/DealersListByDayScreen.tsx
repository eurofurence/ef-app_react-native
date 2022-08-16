import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "../../components/Atoms/Label";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useAppSelector } from "../../store";
import { selectDealersByDayName } from "../../store/eurofurence.selectors";
import { AttendanceDay } from "../../store/eurofurence.types";
import { IconNames } from "../../types/IconNames";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";
import { DealersSectionedListGeneric } from "./DealersSectionedListGeneric";
import { DealersTabsScreenParamsList } from "./DealersTabsScreen";

/**
 * Params handled by the screen in route.
 */
export type DealersListByDayScreenParams = object;

/**
 * The properties to the screen as a component.
 */
export type DealersListByDayScreenProps =
    // Route carrying from dealers tabs screen at any of the day names, own navigation via own parameter list.
    CompositeScreenProps<
        PagesScreenProps<DealersTabsScreenParamsList, "Thu" | "Fri" | "Sat">,
        PagesScreenProps<DealersTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

export const DealersListByDayScreen: FC<DealersListByDayScreenProps> = ({ route }) => {
    const { t } = useTranslation("Dealers");

    // Get the day. Use it to resolve events to display.
    // TODO: @lukashaertel pls fix
    const day = route.name.toLowerCase() as AttendanceDay;
    const dealers = useAppSelector((state) => selectDealersByDayName(state, day));
    const dealersGroups = useMemo(() => {
        return chain(dealers)
            .orderBy("FullName")
            .groupBy((dealer) => dealer.FullName.substring(0, 1).toUpperCase())
            .entries()
            .map(([firstLetter, events]) => ({
                title: firstLetter,
                icon: "bookmark" as IconNames,
                data: events,
            }))
            .value();
    }, [t, dealers]);

    // Formatted lead content.
    const lead = useMemo(
        () =>
            // Match thursday.
            (day === "thu" && t("dealers_on_day", { day: moment().day(4).format("dddd") })) ||
            // Match friday.
            (day === "fri" && t("dealers_on_day", { day: moment().day(5).format("dddd") })) ||
            // Match saturday.
            (day === "sat" && t("dealers_on_day", { day: moment().day(6).format("dddd") })) ||
            // Match saturday.
            t("dealers_on_this_day"),
        [t, day]
    );

    return (
        <DealersSectionedListGeneric
            dealersGroups={dealersGroups}
            leader={
                <Label type="h1" variant="middle" mt={30}>
                    {lead}
                </Label>
            }
        />
    );
};
