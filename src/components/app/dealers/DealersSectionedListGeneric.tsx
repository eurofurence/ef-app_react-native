import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";

import { DealerCard } from "./DealerCard";
import { DealerSection, DealerSectionProps } from "./DealerSection";
import { useDealersRefreshKey } from "../../../hooks/dealers/useDealersRefreshKey";
import { useAppNavigation } from "../../../hooks/nav/useAppNavigation";
import { DealerDetails } from "../../../store/eurofurence.types";
import { useSynchronizer } from "../sync/SynchronizationProvider";

/**
 * The properties to the component.
 */
export type DealersSectionedListGenericProps = {
    leader?: ReactNode;
    dealersGroups: (DealerSectionProps | DealerDetails)[];
    trailer?: ReactNode;
};

export const DealersSectionedListGeneric: FC<DealersSectionedListGenericProps> = ({ leader, dealersGroups, trailer }) => {
    // Use refresh key.
    const refreshKey = useDealersRefreshKey();

    const navigation = useAppNavigation("Areas");
    const navigateTo = useCallback((dealer: DealerDetails) => navigation.push("Dealer", { id: dealer.Id }), [navigation]);
    const synchronizer = useSynchronizer();

    const onPress = useCallback((dealer: DealerDetails) => navigateTo(dealer), [navigateTo]);

    const headerComponent = useMemo(() => <>{leader}</>, [leader]);
    const footerComponent = useMemo(() => <>{trailer}</>, [trailer]);

    const getItemType = useCallback((item: DealerSectionProps | DealerDetails) => ("Id" in item ? "row" : "sectionHeader"), []);
    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<DealerSectionProps | DealerDetails>) => {
            if ("Id" in item) return <DealerCard key={item.Id} dealer={item} onPress={onPress} />;
            else return <DealerSection title={item.title} subtitle={item.subtitle} icon={item.icon} />;
        },
        [onPress],
    );

    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronize}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            ListHeaderComponent={headerComponent}
            ListFooterComponent={footerComponent}
            data={dealersGroups}
            getItemType={getItemType}
            renderItem={renderItem}
            estimatedItemSize={100}
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
