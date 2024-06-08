import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement } from "react";
import { StyleSheet } from "react-native";

import { DealerCard, DealerDetailsInstance } from "./DealerCard";
import { DealersAllProps } from "../../routes/dealers/DealersAll";
import { DealersByDayProps } from "../../routes/dealers/DealersByDay";
import { useSynchronizer } from "../sync/SynchronizationProvider";

/**
 * The properties to the component.
 */
export type DealersListProps = {
    navigation: DealersAllProps["navigation"] | DealersByDayProps["navigation"];
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
                return <DealerCard key={item.details.Id} dealer={item} onPress={(dealer) => navigation.push("Dealer", { id: dealer.Id })} />;
            }}
            estimatedItemSize={110}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});
