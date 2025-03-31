import { FlashList } from "@shopify/flash-list";
import React, { FC, ReactElement, useMemo } from "react";
import { StyleSheet } from "react-native";

import { router } from "expo-router";
import { KbSection } from "./KbSection";
import { KbEntryCard } from "./KbEntryCard";
import { useThemeBackground, useThemeName } from "@/hooks/themes/useThemeHooks";
import { EventDetails, KnowledgeEntryDetails, KnowledgeGroupDetails } from "@/store/eurofurence/types";
import { findIndices } from "@/util/findIndices";
import { useDataCache } from "@/context/DataCacheProvider";

/**
 * The properties to the component.
 */
export type KbSectionedListProps = {
    leader?: ReactElement;
    kbGroups: (KnowledgeGroupDetails | KnowledgeEntryDetails)[];
    select?: (event: EventDetails) => void;
    empty?: ReactElement;
    trailer?: ReactElement;
    sticky?: boolean;
    padEnd?: boolean;
};

export const KbSectionedList: FC<KbSectionedListProps> = ({ leader, kbGroups, empty, trailer, sticky = true, padEnd = true }) => {
    const theme = useThemeName();
    const { isSynchronizing, synchronizeUi } = useDataCache();
    const stickyIndices = useMemo(() => (sticky ? findIndices(kbGroups, (item) => !("KnowledgeGroupId" in item)) : undefined), [kbGroups, sticky]);
    const sectionStyle = useThemeBackground("surface");
    return (
        <FlashList
            refreshing={isSynchronizing}
            onRefresh={synchronizeUi}
            contentContainerStyle={padEnd ? styles.container : undefined}
            scrollEnabled={true}
            stickyHeaderIndices={stickyIndices}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            ListEmptyComponent={empty}
            data={kbGroups}
            getItemType={(item) => ("KnowledgeGroupId" in item ? "row" : "sectionHeader")}
            keyExtractor={(item) => ("KnowledgeGroupId" in item ? item.Id : item.Id)}
            renderItem={({ item }) => {
                if ("KnowledgeGroupId" in item) {
                    return (
                        <KbEntryCard
                            containerStyle={styles.item}
                            entry={item}
                            key={item.Id}
                            onPress={(entry) =>
                                router.navigate({
                                    pathname: "/knowledge/[knowledgeId]",
                                    params: { knowledgeId: entry.Id },
                                })
                            }
                        />
                    );
                } else {
                    return <KbSection style={[styles.item, sectionStyle]} title={item.Name} subtitle={item.Description} icon={item.FontAwesomeIconName ?? "bookmark"} />;
                }
            }}
            estimatedItemSize={59}
            extraData={theme}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 20,
    },
    container: {
        paddingBottom: 100,
    },
});
