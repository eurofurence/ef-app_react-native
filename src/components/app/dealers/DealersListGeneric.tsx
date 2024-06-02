import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";

import { DealerCard } from "./DealerCard";
import { DealersListAllScreenProps } from "../../../app/Dealers/DealersListAllScreen";
import { DealersListByDayScreenProps } from "../../../app/Dealers/DealersListByDayScreen";
import { useDealersRefreshKey } from "../../../hooks/dealers/useDealersRefreshKey";
import { DealerDetails } from "../../../store/eurofurence.types";

/**
 * The properties to the component.
 */
export type DealersListGenericProps = {
    /**
     * Navigation type. Copied from the screens rendering this component.
     */
    navigation: DealersListAllScreenProps["navigation"] | DealersListByDayScreenProps["navigation"];
    leader?: ReactNode;
    dealers: DealerDetails[];
    trailer?: ReactNode;
};

export const DealersListGeneric: FC<DealersListGenericProps> = ({ navigation, leader, dealers, trailer }) => {
    // Use refresh key.
    const refreshKey = useDealersRefreshKey();

    const navigateTo = useCallback((dealer: DealerDetails) => navigation.push("Dealer", { id: dealer.Id }), [navigation]);

    const onPress = useCallback((dealer: DealerDetails) => navigateTo(dealer), [navigateTo]);

    const headerComponent = useMemo(() => <>{leader}</>, [leader]);
    const footerComponent = useMemo(() => <>{trailer}</>, [trailer]);

    const keyExtractor = useCallback(({ Id }: DealerDetails) => Id, []);
    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<DealerDetails>) => {
            return <DealerCard key={item.Id} dealer={item} onPress={onPress} />;
        },
        [onPress],
    );

    return (
        <FlashList
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            ListHeaderComponent={headerComponent}
            ListFooterComponent={footerComponent}
            data={dealers}
            keyExtractor={keyExtractor}
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
