import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement, useMemo } from "react";
import { StyleSheet } from "react-native";

import { DealerCard, DealerDetailsInstance } from "./DealerCard";
import { DealerSection, DealerSectionProps } from "./DealerSection";
import { useThemeName } from "../../hooks/themes/useThemeHooks";
import { DealersAdProps } from "../../routes/dealers/DealersAd";
import { DealersAllProps } from "../../routes/dealers/DealersAll";
import { DealersAlphaProps } from "../../routes/dealers/DealersAlpha";
import { DealersRegularProps } from "../../routes/dealers/DealersRegular";
import { findIndices } from "../../util/findIndices";
import { useSynchronizer } from "../sync/SynchronizationProvider";

/**
 * The properties to the component.
 */
export type DealersSectionedListProps = {
    navigation: DealersAllProps["navigation"] | DealersRegularProps["navigation"] | DealersAdProps["navigation"] | DealersAlphaProps["navigation"];
    leader?: ReactElement;
    dealersGroups: (DealerSectionProps | DealerDetailsInstance)[];
    trailer?: ReactElement;
    sticky?: boolean;
};

export const DealersSectionedList: FC<DealersSectionedListProps> = ({ navigation, leader, dealersGroups, trailer, sticky = true }) => {
    const theme = useThemeName();
    const synchronizer = useSynchronizer();
    const stickyIndices = useMemo(() => (sticky ? findIndices(dealersGroups, (item) => !("details" in item)) : undefined), [dealersGroups, sticky]);

    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronize}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            stickyHeaderIndices={stickyIndices}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            data={dealersGroups}
            getItemType={(item) => ("details" in item ? "row" : "sectionHeader")}
            keyExtractor={(item) => ("details" in item ? item.details.Id : item.title)}
            renderItem={({ item }) => {
                if ("details" in item) {
                    return <DealerCard containerStyle={styles.item} key={item.details.Id} dealer={item} onPress={(dealer) => navigation.push("Dealer", { id: dealer.Id })} />;
                } else {
                    return <DealerSection style={styles.item} title={item.title} subtitle={item.subtitle} icon={item.icon} />;
                }
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
