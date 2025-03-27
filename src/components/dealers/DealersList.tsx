import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement, useCallback } from "react";
import { StyleSheet } from "react-native";

import { useThemeName } from "@/hooks/themes/useThemeHooks";
import { DealerDetails } from "@/store/eurofurence/types";
import { DealerCard, DealerDetailsInstance } from "./DealerCard";
import { router } from "expo-router";
import { useDataCache } from "@/context/DataCacheProvider";

/**
 * The properties to the component.
 */
export type DealersListProps = {
    leader?: ReactElement;
    dealers: DealerDetailsInstance[];
    empty?: ReactElement;
    trailer?: ReactElement;
    padEnd?: boolean;
};

export const DealersList: FC<DealersListProps> = ({ leader, dealers, empty, trailer, padEnd = true }) => {
    const theme = useThemeName();
    const { isSynchronizing, synchronizeUi } = useDataCache();
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
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            ListEmptyComponent={empty}
            data={dealers}
            keyExtractor={(item) => item.details.Id}
            renderItem={({ item }) => {
                return <DealerCard containerStyle={styles.item} key={item.details.Id} dealer={item} onPress={onPress} />;
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
