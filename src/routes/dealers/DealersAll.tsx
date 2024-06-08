import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DealersRouterParamsList } from "./DealersRouter";
import { dealerInstanceForAny } from "../../components/dealers/DealerCard";
import { dealerSectionForLetter } from "../../components/dealers/DealerSection";
import { DealersSectionedList } from "../../components/dealers/DealersSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { conName } from "../../configuration";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { dealersSelectors } from "../../store/eurofurence.selectors";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type DealersAllParams = object;

/**
 * The properties to the screen as a component.
 */
export type DealersAllProps =
    // Route carrying from dealers tabs screen at "All", own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<DealersRouterParamsList, "All">,
        MaterialTopTabScreenProps<DealersRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const DealersAll: FC<DealersAllProps> = ({ navigation }) => {
    const { t } = useTranslation("Dealers");
    const now = useNow();

    // Get the day. Use it to resolve events to display.
    const dealersAll = useAppSelector(dealersSelectors.selectAll);
    const dealersGroups = useMemo(() => {
        const day1 = moment().day(1).format("dddd");
        const day2 = moment().day(2).format("dddd");
        const day3 = moment().day(3).format("dddd");

        return chain(dealersAll)
            .orderBy("FullName")
            .groupBy((dealer) => dealer.FullName.substring(0, 1).toUpperCase())
            .entries()
            .flatMap(([firstLetter, dealers]) => [
                // Header
                dealerSectionForLetter(firstLetter),
                // Dealer instances.
                ...dealers.map((details) => dealerInstanceForAny(details, now, day1, day2, day3)),
            ])
            .value();
    }, [t, now, dealersAll]);

    // Formatted lead content.
    const leader = useMemo(() => {
        return (
            <Label type="h1" variant="middle" mt={30}>
                {t("dealers_at_convention", { convention: conName })}
            </Label>
        );
    }, [t]);

    return <DealersSectionedList navigation={navigation} dealersGroups={dealersGroups} leader={leader} />;
};
