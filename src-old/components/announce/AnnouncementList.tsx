import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement } from "react";
import { StyleSheet } from "react-native";

import { useThemeName } from "../../hooks/themes/useThemeHooks";
import { AnnounceListProps } from "../../routes/announce/AnnounceList";
import { useSynchronizer } from "../sync/SynchronizationProvider";
import { AnnouncementCard, AnnouncementDetailsInstance } from "./AnnouncementCard";

export type AnnouncementListProps = {
    navigation: AnnounceListProps["navigation"];
    leader?: ReactElement;
    announcements: AnnouncementDetailsInstance[];
    empty?: ReactElement;
    trailer?: ReactElement;
    padEnd?: boolean;
};

export const AnnouncementList: FC<AnnouncementListProps> = ({ navigation, leader, announcements, empty, trailer, padEnd = true }) => {
    const theme = useThemeName();
    const synchronizer = useSynchronizer();
    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronizeUi}
            contentContainerStyle={padEnd ? styles.container : undefined}
            scrollEnabled={true}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            ListEmptyComponent={empty}
            data={announcements}
            keyExtractor={(item) => item.details.Id}
            renderItem={({ item }) => {
                return (
                    <AnnouncementCard
                        containerStyle={styles.item}
                        key={item.details.Id}
                        announcement={item}
                        onPress={(announcement) =>
                            navigation.navigate("AnnounceItem", {
                                id: announcement.Id,
                            })
                        }
                    />
                );
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
