import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import _ from "lodash";
import { useCallback, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { InteractiveImage, VisibleViewBounds } from "../../components/Containers/InteractiveImage";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useSentryProfiler } from "../../sentryHelpers";
import { useAppSelector } from "../../store";
import { imagesSelectors, mapsSelectors } from "../../store/eurofurence.selectors";
import { ImageDetails, LinkFragment, MapDetails } from "../../store/eurofurence.types";
import { appStyles } from "../AppStyles";
import { ScreenEmpty } from "../Common/ScreenEmpty";
import { LinkItem } from "./LinkItem";

export const MapScreen = () => {
    useSentryProfiler("MapScreen");
    const safe = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheet>(null);
    const previousFiltered = useRef<any[]>([]);
    const route2 = useAppRoute("Map");
    const [visibleEntries, setVisibleEntries] = useState<{ title: string; data: LinkFragment[] }[]>([]);
    const [isFiltering, setIsFiltering] = useState(false);

    const map = useAppSelector((state): MapDetails | undefined => mapsSelectors.selectById(state, route2.params.id));
    const image = useAppSelector((state): ImageDetails | undefined => (map?.ImageId ? imagesSelectors.selectById(state, map?.ImageId) : undefined));

    const filterEntries = useCallback(
        (bounds: VisibleViewBounds) => {
            const middleX = (bounds.left + bounds.right) / 2;
            const middleY = (bounds.bottom + bounds.top) / 2;

            setIsFiltering(true);
            console.log("Filtering map entries", bounds);

            const filteredEntries = _.chain(map?.Entries)
                .filter((it) => _.inRange(it.X, bounds.left, bounds.right) && _.inRange(it.Y, bounds.top, bounds.bottom))
                .orderBy((it) => Math.sqrt(Math.pow(it.X + middleX, 2) + Math.pow(it.Y + middleY, 2)), "asc")
                .map((it, index) => ({
                    title: it.Id + index,
                    data: it.Links,
                }))
                .value();

            setVisibleEntries(filteredEntries ?? []);
            console.log("Filtered entries", filteredEntries?.length);

            setIsFiltering(false);

            if (filteredEntries.length > 0) {
                if (previousFiltered.current.length === 0) {
                    // if there are no previous entries but there are current, open the sheet.
                    sheetRef.current?.snapToIndex(0);
                }
            } else {
                if (previousFiltered.current.length > 0 && filteredEntries.length === 0) {
                    // If there are previous items but no current, we close the sheet
                    sheetRef.current?.close();
                }
            }
            previousFiltered.current = filteredEntries;
        },
        [map]
    );

    if (map === undefined || image === undefined) {
        return <ScreenEmpty />;
    }

    return (
        <View style={[appStyles.abs, safe]}>
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
