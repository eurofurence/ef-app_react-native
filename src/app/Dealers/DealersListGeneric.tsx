import { ListRenderItemInfo } from "@react-native/virtualized-lists/Lists/VirtualizedList";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { DealerCard } from "./DealerCard";
import { DealersListAllScreenProps } from "./DealersListAllScreen";
import { DealersListByDayScreenProps } from "./DealersListByDayScreen";
import { DealerDetails } from "../../store/eurofurence.types";

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
        <View style={StyleSheet.absoluteFill}>
            <FlatList
                style={styles.list}
                contentContainerStyle={styles.container}
                scrollEnabled={true}
                ListHeaderComponent={headerComponent}
                ListFooterComponent={footerComponent}
                data={dealers}
                keyExtractor={keyExtractor}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                renderItem={renderItem}
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
