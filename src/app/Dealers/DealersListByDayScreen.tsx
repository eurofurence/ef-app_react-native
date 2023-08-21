import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DealersSectionedListGeneric } from "./DealersSectionedListGeneric";
import { DealersTabsScreenParamsList } from "./DealersTabsScreen";
import { IconNames } from "../../components/Atoms/Icon";
import { Label } from "../../components/Atoms/Label";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useAppSelector } from "../../store";
import { selectDealersByDayName } from "../../store/eurofurence.selectors";
import { AttendanceDay } from "../../store/eurofurence.types";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";

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
        PagesScreenProps<DealersTabsScreenParamsList, "Mon" | "Tue" | "Wed">,
        PagesScreenProps<DealersTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

export const DealersListByDayScreen: FC<DealersListByDayScreenProps> = ({ route }) => {
    const { t } = useTranslation("Dealers");

    // Get the day. Use it to resolve events to display.
    const day = route.name.toLowerCase() as AttendanceDay;
    const dealers = useAppSelector((state) => selectDealersByDayName(state, day));
    const dealersGroups = useMemo(() => {
        return chain(dealers)
            .orderBy("FullName")
            .groupBy((dealer) => dealer.FullName.substring(0, 1).toUpperCase())
            .entries()
            .flatMap(([firstLetter, dealers]) => [
                {
                    title: firstLetter,
                    icon: "bookmark" as IconNames,
                },
                ...dealers,
            ])
            .value();
    }, [t, dealers]);

    // Formatted lead content.
    const lead = useMemo(
        () =>
            // Match thursday.
            (day === "mon" && t("dealers_on_day", { day: moment().day(1).format("dddd") })) ||
            // Match friday.
            (day === "tue" && t("dealers_on_day", { day: moment().day(2).format("dddd") })) ||
            // Match saturday.
            (day === "wed" && t("dealers_on_day", { day: moment().day(3).format("dddd") })) ||
            // Match saturday.
            t("dealers_on_this_day"),
        [t, day],
    );

    const leader = useMemo(() => {
        return (
            <Label type="h1" variant="middle" mt={30}>
                {lead}
            </Label>
        );
    }, [lead]);

    return <DealersSectionedListGeneric dealersGroups={dealersGroups} leader={leader} />;
};
