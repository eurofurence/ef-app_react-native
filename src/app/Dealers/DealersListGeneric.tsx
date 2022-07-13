import { clone } from "lodash";
import { FC, ReactNode, useCallback, useState } from "react";
import { FlatList, StyleSheet, Vibration, View } from "react-native";

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
    // Set dealer for action sheet
    const [selectedDealer, setSelectedDealer] = useState<EnrichedDealerRecord | undefined>(undefined);

    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback(
        (dealer) =>
            navigation.push("Dealer", {
                id: dealer.Id,
                dealer: clone(dealer),
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
                renderItem={(entry: { item: EnrichedDealerRecord }) => (
                    <View key={entry.item.Id} style={{ padding: 10 }}>
                        <Button
                            style={{ height: 60 }}
                            outline
                            onPress={() => navigateTo(entry.item)}
                            onLongPress={() => {
                                Vibration.vibrate(50);
                                setSelectedDealer(entry.item);
                            }}
                        >
                            {entry.item.DisplayName || entry.item.AttendeeNickname}
                        </Button>
                    </View>
                )}
            />
            {/*<EventActionsSheet eventRecord={selectedEvent} onClose={() => setSelectedEvent(undefined)} />*/}
        </View>
    );
};
