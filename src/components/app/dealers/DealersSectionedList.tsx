import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement } from "react";
import { StyleSheet } from "react-native";

import { DealerCard, DealerDetailsInstance } from "./DealerCard";
import { DealerSection, DealerSectionProps } from "./DealerSection";
import { useDealersRefreshKey } from "../../../hooks/dealers/useDealersRefreshKey";
import { DealersAllProps } from "../../../routes/dealers/DealersAll";
import { DealersByDayProps } from "../../../routes/dealers/DealersByDay";
import { useSynchronizer } from "../sync/SynchronizationProvider";

/**
 * The properties to the component.
 */
export type DealersSectionedListProps = {
    navigation: DealersAllProps["navigation"] | DealersByDayProps["navigation"];
    leader?: ReactElement;
    dealersGroups: (DealerSectionProps | DealerDetailsInstance)[];
    trailer?: ReactElement;
};

export const DealersSectionedList: FC<DealersSectionedListProps> = ({ navigation, leader, dealersGroups, trailer }) => {
    // Use refresh key.
    const refreshKey = useDealersRefreshKey();
    const synchronizer = useSynchronizer();

    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronize}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            data={dealersGroups}
            getItemType={(item) => ("details" in item ? "row" : "sectionHeader")}
            keyExtractor={(item) => ("details" in item ? item.details.Id : item.title)}
            renderItem={({ item }) => {
                if ("details" in item) {
                    return <DealerCard key={item.details.Id} dealer={item} onPress={(dealer) => navigation.push("Dealer", { id: dealer.Id })} />;
                } else {
                    return <DealerSection title={item.title} subtitle={item.subtitle} icon={item.icon} />;
                }
            }}
            estimatedItemSize={110}
            extraData={refreshKey}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});
