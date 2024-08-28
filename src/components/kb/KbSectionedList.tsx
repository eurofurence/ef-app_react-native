import { FlashList } from "@shopify/flash-list";
import React, { FC, ReactElement, useMemo } from "react";
import { StyleSheet } from "react-native";

import { KbEntryCard } from "./KbEntryCard";
import { KbSection } from "./KbSection";
import { useThemeBackground, useThemeName } from "../../hooks/themes/useThemeHooks";
import { KbListProps } from "../../routes/kb/KbList";
import { EventDetails, KnowledgeEntryDetails, KnowledgeGroupDetails } from "../../store/eurofurence/types";
import { findIndices } from "../../util/findIndices";
import { useSynchronizer } from "../sync/SynchronizationProvider";

/**
 * The properties to the component.
 */
export type KbSectionedListProps = {
    navigation: KbListProps["navigation"];
    leader?: ReactElement;
    kbGroups: (KnowledgeGroupDetails | KnowledgeEntryDetails)[];
    select?: (event: EventDetails) => void;
    empty?: ReactElement;
    trailer?: ReactElement;
    sticky?: boolean;
    padEnd?: boolean;
};

export const KbSectionedList: FC<KbSectionedListProps> = ({ navigation, leader, kbGroups, empty, trailer, sticky = true, padEnd = true }) => {
    const theme = useThemeName();
    const synchronizer = useSynchronizer();
    const stickyIndices = useMemo(() => (sticky ? findIndices(kbGroups, (item) => !("KnowledgeGroupId" in item)) : undefined), [kbGroups, sticky]);
    const sectionStyle = useThemeBackground("surface");
    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronizeUi}
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
                    return <KbEntryCard containerStyle={styles.item} entry={item} key={item.Id} onPress={(entry) => navigation.navigate("KnowledgeEntry", { id: entry.Id })} />;
                } else {
                    return <KbSection style={[styles.item, sectionStyle]} title={item.Name} subtitle={item.Description} icon={item.FaIconName ?? "bookmark"} />;
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
