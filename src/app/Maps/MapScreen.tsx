import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import _ from "lodash";
import { useCallback, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { Header } from "../../components/Containers/Header";
import { InteractiveImage, VisibleViewBounds } from "../../components/Containers/InteractiveImage";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { imagesSelectors, mapsSelectors } from "../../store/eurofurence.selectors";
import { EnrichedImageRecord, EnrichedMapRecord, LinkFragment } from "../../store/eurofurence.types";
import { LinkItem } from "./LinkItem";

export const MapScreen = () => {
    const sheetRef = useRef<BottomSheet>(null);
    const route2 = useAppRoute("Map");
    const [visibleEntries, setVisibleEntries] = useState<{ title: string; data: LinkFragment[] }[]>([]);
    const [isFiltering, setIsFiltering] = useState(false);

    const map = useAppSelector((state): EnrichedMapRecord | undefined => mapsSelectors.selectById(state, route2.params.id));
    const image = useAppSelector((state): EnrichedImageRecord | undefined => (map?.ImageId ? imagesSelectors.selectById(state, map?.ImageId) : undefined));

    const filterEntries = useCallback(
        (bounds: VisibleViewBounds) => {
            setIsFiltering(true);
            console.log("Filtering map entries", bounds);

            const filteredEntries = map?.Entries.filter((it) => _.inRange(it.X, bounds.left, bounds.right) && _.inRange(it.Y, bounds.top, bounds.bottom)).map((it, index) => ({
                title: it.Id + index,
                data: it.Links,
            }));

            setVisibleEntries(filteredEntries ?? []);
            console.log("Filtered entries", filteredEntries?.length);

            setIsFiltering(false);

            if (filteredEntries && filteredEntries.length > 0) {
                sheetRef.current?.snapToIndex(0);
            } else {
                sheetRef.current?.close();
            }
        },
        [map]
    );

    if (map === undefined || image === undefined) {
        return <Text>Nothing here but the bees . . .</Text>;
    }

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header>{map.Description}</Header>
            <InteractiveImage image={image} maxScale={10} onBoundsUpdated={filterEntries} />
            {/* Apparently we cannot render this in a browser */}
            {Platform.OS !== "web" && (
                <BottomSheet snapPoints={["10%", "75%"]} index={0} ref={sheetRef}>
                    <BottomSheetSectionList
                        refreshing={isFiltering}
                        sections={visibleEntries}
                        keyExtractor={(item) => item.Target}
                        renderItem={({ item }) => <LinkItem link={item} />}
                        contentContainerStyle={{ paddingHorizontal: 15 }}
                    />
                </BottomSheet>
            )}
        </View>
    );
};
