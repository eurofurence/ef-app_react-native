import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement } from "react";
import { StyleSheet } from "react-native";

import { DealerCard, DealerDetailsInstance } from "./DealerCard";
import { DealersAdProps } from "../../routes/dealers/DealersAd";
import { DealersAllProps } from "../../routes/dealers/DealersAll";
import { DealersRegularProps } from "../../routes/dealers/DealersRegular";
import { useSynchronizer } from "../sync/SynchronizationProvider";

/**
 * The properties to the component.
 */
export type DealersListProps = {
    navigation: DealersAllProps["navigation"] | DealersRegularProps["navigation"] | DealersAdProps["navigation"];
    leader?: ReactElement;
    dealers: DealerDetailsInstance[];
    trailer?: ReactElement;
};

export const DealersList: FC<DealersListProps> = ({ navigation, leader, dealers, trailer }) => {
    const synchronizer = useSynchronizer();
    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronize}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            data={dealers}
            keyExtractor={(item) => item.details.Id}
            renderItem={({ item }) => {
                return <DealerCard containerStyle={styles.item} key={item.details.Id} dealer={item} onPress={(dealer) => navigation.push("Dealer", { id: dealer.Id })} />;
            }}
            estimatedItemSize={110}
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
