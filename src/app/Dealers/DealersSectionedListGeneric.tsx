import { FC, ReactNode, useCallback } from "react";
import { SectionList, StyleSheet, View } from "react-native";

import { DealerCard } from "./DealerCard";
import { DealerSection, DealerSectionProps } from "./DealerSection";
import { useSynchronizer } from "../../components/Synchronization/SynchronizationProvider";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { DealerDetails } from "../../store/eurofurence.types";

export type DealersSectionedListItem = DealerSectionProps & {
    data: DealerDetails[];
};

/**
 * The properties to the component.
 */
export type DealersSectionedListGenericProps = {
    leader?: ReactNode;
    dealersGroups: DealersSectionedListItem[];
    trailer?: ReactNode;
};

export const DealersSectionedListGeneric: FC<DealersSectionedListGenericProps> = ({ leader, dealersGroups, trailer }) => {
    const navigation = useAppNavigation("Areas");
    const navigateTo = useCallback((dealer: DealerDetails) => navigation.push("Dealer", { id: dealer.Id }), [navigation]);
    const synchronizer = useSynchronizer();

    const onPress = useCallback((dealer: DealerDetails) => navigateTo(dealer), [navigateTo]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <SectionList
                refreshing={synchronizer.isSynchronizing}
                onRefresh={synchronizer.synchronize}
                style={styles.list}
                contentContainerStyle={styles.container}
                scrollEnabled={true}
                ListHeaderComponent={<>{leader}</>}
                ListFooterComponent={<>{trailer}</>}
                sections={dealersGroups}
                keyExtractor={(item) => item.Id}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                renderSectionHeader={({ section }) => <DealerSection title={section.title} subtitle={section.subtitle} icon={section.icon} />}
                renderItem={(entry: { item: DealerDetails }) => <DealerCard key={entry.item.Id} dealer={entry.item} onPress={onPress} />}
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
