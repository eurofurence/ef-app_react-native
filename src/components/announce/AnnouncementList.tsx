import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement } from "react";
import { StyleSheet } from "react-native";

import { router } from "expo-router";
import { AnnouncementCard, AnnouncementDetailsInstance } from "./AnnouncementCard";
import { useThemeName } from "@/hooks/themes/useThemeHooks";

export type AnnouncementListProps = {
    leader?: ReactElement;
    announcements: AnnouncementDetailsInstance[];
    empty?: ReactElement;
    trailer?: ReactElement;
    padEnd?: boolean;
};

export const AnnouncementList: FC<AnnouncementListProps> = ({ leader, announcements, empty, trailer, padEnd = true }) => {
    const theme = useThemeName();
    return (
        <FlashList
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
                            router.navigate({
                                pathname: "/announcements/[announcementId]",
                                params: { announcementId: announcement.Id },
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
