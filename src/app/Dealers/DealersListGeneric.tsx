import { FC, ReactNode, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { DealerWithDetails } from "../../store/eurofurence.selectors";
import { DealerCard } from "./DealerCard";
import { DealersListAllScreenProps } from "./DealersListAllScreen";
import { DealersListByDayScreenProps } from "./DealersListByDayScreen";

/**
 * The properties to the component.
 */
export type DealersListGenericProps = {
    /**
     * Navigation type. Copied from the screens rendering this component.
     */
    navigation: DealersListAllScreenProps["navigation"] | DealersListByDayScreenProps["navigation"];
    leader?: ReactNode;
    dealers: DealerWithDetails[];
    trailer?: ReactNode;
};

export const DealersListGeneric: FC<DealersListGenericProps> = ({ navigation, leader, dealers, trailer }) => {
    const navigateTo = useCallback((dealer) => navigation.push("Dealer", { id: dealer.Id }), [navigation]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <FlatList
                style={styles.list}
                contentContainerStyle={styles.container}
                scrollEnabled={true}
                ListHeaderComponent={<>{leader}</>}
                ListFooterComponent={<>{trailer}</>}
                data={dealers}
                keyExtractor={(item) => item.Id}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                renderItem={(entry: { item: DealerWithDetails }) => <DealerCard key={entry.item.Id} dealer={entry.item} onPress={() => navigateTo(entry.item)} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    container: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});