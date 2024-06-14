import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { useDealerGroups } from "./Dealers.common";
import { DealersRouterParamsList } from "./DealersRouter";
import { DealersSectionedList } from "../../components/dealers/DealersSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { Search } from "../../components/generic/atoms/Search";
import { useFuseIntegration } from "../../hooks/searching/useFuseIntegration";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { selectDealersInAd } from "../../store/eurofurence/selectors/dealers";
import { selectDealersInAdSearchIndex } from "../../store/eurofurence/selectors/search";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type DealersAdParams = object;

/**
 * The properties to the screen as a component.
 */
export type DealersAdProps =
    // Route carrying from dealers tabs screen at any of the day names, own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<DealersRouterParamsList, "AD">,
        MaterialTopTabScreenProps<DealersRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const DealersAd: FC<DealersAdProps> = ({ navigation }) => {
    // General state.
    const { t } = useTranslation("Dealers");
    const now = useNow();

    // Search integration.
    const [filter, setFilter, results] = useFuseIntegration(selectDealersInAdSearchIndex);

    // Use all dealers in after-dark and group generically.
    const dealersAd = useAppSelector(selectDealersInAd);
    const dealersGroups = useDealerGroups(t, now, results, dealersAd);

    return (
        <DealersSectionedList
            navigation={navigation}
            dealersGroups={dealersGroups}
            leader={
                <>
                    <Label type="lead" variant="middle" mt={30}>
                        {t("dealers_in_ad")}
                    </Label>
                    <Search filter={filter} setFilter={setFilter} placeholder="What are you looking for" />
                </>
            }
        />
    );
};
