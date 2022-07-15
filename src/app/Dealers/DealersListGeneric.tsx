import { FC, ReactNode, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { Button } from "../../components/Containers/Button";
import { EnrichedDealerRecord } from "../../store/eurofurence.types";
import { DealersListAllScreenProps } from "./DealersListAllScreen";

/**
 * The properties to the component.
 */
export type DealersListGenericProps = {
    /**
     * Navigation type. Copied from the screens rendering this component.
     */
    navigation: DealersListAllScreenProps["navigation"];
    leader?: ReactNode;
    dealers: EnrichedDealerRecord[];
    trailer?: ReactNode;
};

export const DealersListGeneric: FC<DealersListGenericProps> = ({ navigation, leader, dealers, trailer }) => {
    const navigateTo = useCallback(
        (dealer) =>
            navigation.push("Dealer", {
                id: dealer.Id,
            }),
        [navigation]
    );

    return (
        <View style={StyleSheet.absoluteFill}>
            <FlatList
                scrollEnabled={true}
                ListHeaderComponent={<>{leader}</>}
                ListFooterComponent={<>{trailer}</>}
                data={dealers}
                keyExtractor={(item) => item.Id}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                renderItem={(entry: { item: EnrichedDealerRecord }) => (
                    <View key={entry.item.Id} style={{ padding: 10 }}>
                        <Button style={{ height: 60 }} outline onPress={() => navigateTo(entry.item)}>
                            {entry.item.DisplayName || entry.item.AttendeeNickname}
                        </Button>
                    </View>
                )}
            />
        </View>
    );
};
