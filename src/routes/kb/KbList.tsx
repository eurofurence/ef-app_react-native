import { StackScreenProps } from "@react-navigation/stack";
import Fuse from "fuse.js";
import { chain } from "lodash";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../../components/AppStyles";
import { Search } from "../../components/generic/atoms/Search";
import { Header } from "../../components/generic/containers/Header";
import { KbSectionedList } from "../../components/kb/KbSectionedList";
import { useFuseIntegration } from "../../hooks/searching/useFuseIntegration";
import { useAppSelector } from "../../store";
import { dealersSelectors, knowledgeEntriesSelectors, selectKnowledgeItems } from "../../store/eurofurence.selectors";
import { DealerDetails, KnowledgeEntryDetails } from "../../store/eurofurence.types";
import { IndexRouterParamsList } from "../IndexRouter";
import { dealerSearchOptions, dealerSearchProperties } from "../dealers/Dealers.common";

// TODO: FUSE refactoring
/**
 * Properties to use in search.
 */
export const kbSearchProperties: Fuse.FuseOptionKey<KnowledgeEntryDetails>[] = [
    {
        name: "Title",
        weight: 1.5,
    },
    {
        name: "Text",
        weight: 1,
    },
];

/**
 * Search options.
 */
export const kbSearchOptions: Fuse.IFuseOptions<KnowledgeEntryDetails> = {
    shouldSort: true,
    threshold: 0.3,
};

/**
 * Params handled by the screen in route, nothing so far.
 */
export type KbListParams = undefined; // TODO.

/**
 * The properties to the screen as a component.
 */
export type KbListProps = StackScreenProps<IndexRouterParamsList, "KnowledgeGroups">;

export const KbList: FC<KbListProps> = ({ navigation }) => {
    const safe = useSafeAreaInsets();
    const { t } = useTranslation("KnowledgeGroups");
    // Search integration.
    const [filter, setFilter, results] = useFuseIntegration(knowledgeEntriesSelectors.selectAll, kbSearchProperties, kbSearchOptions);

    const groups = useAppSelector((state) => selectKnowledgeItems(state));
    const all = useMemo(() => {
        if (results) return results;
        else
            return chain(groups)
                .flatMap(({ group, entries }) => [group, ...entries])
                .value();
    }, [results, groups]);

    return (
        <View style={[appStyles.abs, safe]}>
            <Header>{t("header")}</Header>
            <KbSectionedList
                navigation={navigation}
                kbGroups={all}
                leader={
                    <>
                        <Search filter={filter} setFilter={setFilter} placeholder="What are you looking for" />
                    </>
                }
            />
        </View>
    );
};
