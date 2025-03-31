import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";

import { router } from "expo-router";
import { DealerSection, DealerSectionProps } from "./DealerSection";
import { DealerCard, DealerDetailsInstance } from "./DealerCard";
import { useThemeName } from "@/hooks/themes/useThemeHooks";
import { findIndices } from "@/util/findIndices";
import { DealerDetails } from "@/store/eurofurence/types";
import { useDataCache } from "@/context/DataCacheProvider";

/**
 * The properties to the component.
 */
export type DealersSectionedListProps = {
    leader?: ReactElement;
    dealersGroups: (DealerSectionProps | DealerDetailsInstance)[];
    empty?: ReactElement;
    trailer?: ReactElement;
    sticky?: boolean;
    padEnd?: boolean;
};

export const DealersSectionedList: FC<DealersSectionedListProps> = ({ leader, dealersGroups, empty, trailer, sticky = true, padEnd = true }) => {
    const theme = useThemeName();
    const { isSynchronizing, synchronizeUi } = useDataCache();
    const stickyIndices = useMemo(() => (sticky ? findIndices(dealersGroups, (item) => !("details" in item)) : undefined), [dealersGroups, sticky]);
    const onPress = useCallback((dealer: DealerDetails) => {
        router.navigate({
            pathname: "/dealers/[dealerId]",
            params: { dealerId: dealer.Id },
        });
    }, []);
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
            data={dealersGroups}
            getItemType={(item) => ("details" in item ? "row" : "sectionHeader")}
            keyExtractor={(item) => ("details" in item ? item.details.Id : item.title)}
            renderItem={({ item }) => {
                if ("details" in item) {
                    return <DealerCard containerStyle={styles.item} dealer={item} onPress={onPress} />;
                } else {
                    return <DealerSection style={styles.item} title={item.title} subtitle={item.subtitle} icon={item.icon} />;
                }
            }}
            estimatedItemSize={110}
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
