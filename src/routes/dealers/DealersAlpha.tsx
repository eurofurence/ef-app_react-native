import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { useDealerAlphabeticalGroups } from "./Dealers.common";
import { DealersRouterParamsList } from "./DealersRouter";
import { DealersSectionedList } from "../../components/dealers/DealersSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { Search } from "../../components/generic/atoms/Search";
import { conName } from "../../configuration";
import { useFuseIntegration } from "../../hooks/searching/useFuseIntegration";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { dealersSelectors } from "../../store/eurofurence/selectors/records";
import { selectDealersAllSearchIndex } from "../../store/eurofurence/selectors/search";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type DealersAlphaParams = object;

/**
 * The properties to the screen as a component.
 */
export type DealersAlphaProps =
    // Route carrying from dealers tabs screen at "All", own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<DealersRouterParamsList, "Alpha">,
        MaterialTopTabScreenProps<DealersRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const DealersAlpha: FC<DealersAlphaProps> = ({ navigation }) => {
    // General state.
    const { t } = useTranslation("Dealers");
    const now = useNow();

    // Search integration.
    const [filter, setFilter, results] = useFuseIntegration(selectDealersAllSearchIndex);

    // Use all dealers and group generically.
    const dealersAll = useAppSelector(dealersSelectors.selectAll);
    const dealersGroups = useDealerAlphabeticalGroups(t, now, results, dealersAll);

    return (
        <DealersSectionedList
            navigation={navigation}
            dealersGroups={dealersGroups}
            leader={
                <>
                    <Label type="lead" variant="middle" mt={30}>
                        {t("dealers_at_convention", { convention: conName })}
                    </Label>
                    <Search filter={filter} setFilter={setFilter} />
                </>
            }
        />
    );
};
