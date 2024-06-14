import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Search } from "../../components/generic/atoms/Search";
import { Header } from "../../components/generic/containers/Header";
import { KbSectionedList } from "../../components/kb/KbSectionedList";
import { useFuseIntegration } from "../../hooks/searching/useFuseIntegration";
import { useAppSelector } from "../../store";
import { selectKnowledgeItems } from "../../store/eurofurence/selectors/kb";
import { selectKbAllSearchIndex } from "../../store/eurofurence/selectors/search";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route, nothing so far.
 */
export type KbListParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type KbListProps = StackScreenProps<IndexRouterParamsList, "KnowledgeGroups">;

export const KbList: FC<KbListProps> = ({ navigation }) => {
    const { t } = useTranslation("KnowledgeGroups");
    // Search integration.
    const [filter, setFilter, results] = useFuseIntegration(selectKbAllSearchIndex);

    const groups = useAppSelector((state) => selectKnowledgeItems(state));
    const all = useMemo(() => {
        if (results) return results;
        else
            return chain(groups)
                .flatMap(({ group, entries }) => [group, ...entries])
                .value();
    }, [results, groups]);

    return (
        <View style={StyleSheet.absoluteFill}>
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
