import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement } from "react";
import { StyleSheet } from "react-native";

import { DealerCard, DealerDetailsInstance } from "./DealerCard";
import { useThemeName } from "../../hooks/themes/useThemeHooks";
import { DealersAdProps } from "../../routes/dealers/DealersAd";
import { DealersAllProps } from "../../routes/dealers/DealersAll";
import { DealersAlphaProps } from "../../routes/dealers/DealersAlpha";
import { DealersRegularProps } from "../../routes/dealers/DealersRegular";
import { PersonalDealersProps } from "../../routes/dealers/PersonalDealers";
import { useSynchronizer } from "../sync/SynchronizationProvider";

/**
 * The properties to the component.
 */
export type DealersListProps = {
    navigation:
        | DealersAllProps["navigation"]
        | PersonalDealersProps["navigation"]
        | DealersRegularProps["navigation"]
        | DealersAdProps["navigation"]
        | DealersAlphaProps["navigation"];
    leader?: ReactElement;
    dealers: DealerDetailsInstance[];
    empty?: ReactElement;
    trailer?: ReactElement;
};

export const DealersList: FC<DealersListProps> = ({ navigation, leader, dealers, empty, trailer }) => {
    const theme = useThemeName();
    const synchronizer = useSynchronizer();
    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronize}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            ListEmptyComponent={empty}
            data={dealers}
            keyExtractor={(item) => item.details.Id}
            renderItem={({ item }) => {
                return <DealerCard containerStyle={styles.item} key={item.details.Id} dealer={item} onPress={(dealer) => navigation.navigate("Dealer", { id: dealer.Id })} />;
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
