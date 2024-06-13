import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { dealerSearchOptions, dealerSearchProperties, useDealerGroups } from "./Dealers.common";
import { DealersRouterParamsList } from "./DealersRouter";
import { DealersSectionedList } from "../../components/dealers/DealersSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { Search } from "../../components/generic/atoms/Search";
import { useFuseIntegration } from "../../hooks/searching/useFuseIntegration";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { dealersSelectors, selectDealersInRegular } from "../../store/eurofurence.selectors";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type DealersRegularParams = object;

/**
 * The properties to the screen as a component.
 */
export type DealersRegularProps =
    // Route carrying from dealers tabs screen at any of the day names, own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<DealersRouterParamsList, "Regular">,
        MaterialTopTabScreenProps<DealersRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const DealersRegular: FC<DealersRegularProps> = ({ navigation }) => {
    // General state.
    const { t } = useTranslation("Dealers");
    const now = useNow();

    // Search integration.
    const [filter, setFilter, results] = useFuseIntegration(dealersSelectors.selectAll, dealerSearchProperties, dealerSearchOptions);

    // Use all dealers in regular and group generically.
    const dealersRegular = useAppSelector(selectDealersInRegular);
    const dealersGroups = useDealerGroups(t, now, results, dealersRegular);

    return (
        <DealersSectionedList
            navigation={navigation}
            dealersGroups={dealersGroups}
            leader={
                <>
                    <Label type="lead" variant="middle" mt={30}>
                        {t("dealers_in_regular")}
                    </Label>
                    <Search filter={filter} setFilter={setFilter} placeholder="What are you looking for" />
                </>
            }
        />
    );
};
