import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { ReactNativeZoomableView as ZoomableView, ZoomableViewEvent } from "@openspacelabs/react-native-zoomable-view";
import { ListRenderItemInfo } from "@react-native/virtualized-lists/Lists/VirtualizedList";
import { chain, clamp } from "lodash";
import * as React from "react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, InteractionManager, Platform, StyleSheet, View, ViewStyle } from "react-native";

import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { ImageDetails, LinkFragment, MapDetails, MapEntryDetails } from "../../store/eurofurence/types";
import { Image } from "../generic/atoms/Image";
import { Label } from "../generic/atoms/Label";
import { Marker } from "../generic/atoms/Marker";
import { sourceFromImage } from "../generic/atoms/Image.common";
import { LinkItem } from "./LinkItem";

const distSq = (hx: number, hy: number) => hx * hx + hy * hy;
const circleTouches = (x1: number, y1: number, x2: number, y2: number, x: number, y: number, r: number) => {
    const ix = clamp(x, x1, x2);
    const iy = clamp(y, y1, y2);
    return distSq(ix - x, iy - y) < r * r;
};

type FilterResult = {
    key: string;
    map: MapDetails;
    entry: MapEntryDetails;
    link: LinkFragment;
};

export type MapContentProps = {
    map: MapDetails & { Image: ImageDetails };
    entry?: MapEntryDetails;
    link?: LinkFragment;
};

/**
 * Returns a normal flat list on web for compatibility.
 */
const MapContentFlatList = Platform.OS === "web" ? FlatList : BottomSheetFlatList;

export const MapContent: FC<MapContentProps> = ({ map, entry }) => {
    const { t } = useTranslation("Maps");
    const refHandle = useRef<any>([0, 0]);
    const refZoom = useRef<ZoomableView>(null);
    const refSheet = useRef<BottomSheet>(null);

    const styleBackground = useThemeBackground("background");
    const styleHandle = useThemeBackground("inverted");

    const [results, setResults] = useState<FilterResult[]>([]);
    const [filtering, setFiltering] = useState(false);
    const onTransform = useCallback(
        (event: ZoomableViewEvent) => {
            // Mark filtering start.
            setFiltering(true);

            // Clear last handle if it did not run yet.
            clearTimeout(refHandle.current);

            // Create timeout with handle.
            const ownHandle = setTimeout(() => {
                InteractionManager.runAfterInteractions(() => {
                    // Get arguments from event.
                    const targetWidth = event.originalWidth;
                    const targetHeight = event.originalHeight;
                    const offsetX = event.offsetX;
                    const offsetY = event.offsetY;
                    const zoom = event.zoomLevel;

                    // Get area and area center.
                    const x1 = ((map.Image.Width * zoom) / 2 - offsetX * zoom - targetWidth / 2) / zoom;
                    const x2 = x1 + targetWidth / zoom;
                    const y1 = ((map.Image.Height * zoom) / 2 - offsetY * zoom - targetHeight / 2) / zoom;
                    const y2 = y1 + targetHeight / zoom;
                    const centerX = (x1 + x2) / 2;
                    const centerY = (y1 + y2) / 2;

                    // Filter all that touch the view. Order ascending by square distance and then add all their links.
                    const results = chain(map?.Entries)
                        .filter((entry) => circleTouches(x1, y1, x2, y2, entry.X, entry.Y, entry.TapRadius))
                        .orderBy((entry) => distSq(entry.X - centerX, entry.Y - centerY), "asc")
                        .flatMap((entry) => entry.Links.map((link, i) => ({ key: `${map.Id}/${entry.Id}#${i}`, map, entry, link })))
                        .value();

                    // Assign if this is still the active handle.
                    if (refHandle.current === ownHandle) {
                        setResults(results);
                        setFiltering(false);
                    }
                });
            }, 350);

            // Assign handle.
            refHandle.current = ownHandle;
        },
        [map],
    );

    useEffect(() => {
        if (!refSheet.current) return;
        if (entry) refSheet.current.collapse();
    }, [entry]);

    // On change of entry, move to new location.
    useEffect(() => {
        if (!entry) return;
        if (!refZoom.current) return;
        // Get arguments from current status.
        const current = refZoom.current._getZoomableViewEventObject();
        const offsetX = current.offsetX;
        const offsetY = current.offsetY;
        const zoom = current.zoomLevel;

        // Get change to current center.
        const diffX = entry.X - (map.Image.Width / 2 - offsetX);
        const diffY = entry.Y - (map.Image.Height / 2 - offsetY);
        refZoom.current.moveBy(diffX * zoom, diffY * zoom).catch(() => undefined);
    }, [entry, refZoom, map]);

    // Compute containers.
    const styleContainer = useMemo<ViewStyle>(() => ({ width: map.Image.Width, height: map.Image.Height }), [map]);
    const styleMarker = useMemo<ViewStyle>(() => (!entry ? { display: "none" } : { left: entry.X, top: entry.Y }), [entry]);

    // Determine zoom levels.
    const minZoom = Dimensions.get("window").width / map.Image.Width;
    const maxZoom = minZoom * 5;

    // List header component.
    const header = useMemo(
        () => (
            <Label mt={15} mb={15} variant="middle">
                <Label type="italic">{filtering ? t("filtering") : t("results")}</Label>
            </Label>
        ),
        [t, filtering],
    );

    // Key extractor callback.
    const keyExtractor = useCallback(({ key }: FilterResult) => key, []);

    // Render item callback.
    const renderItem = useCallback(({ item: { map, entry, link } }: ListRenderItemInfo<FilterResult>) => {
        return <LinkItem map={map} entry={entry} link={link} />;
    }, []);

    return (
        <View style={styles.container} testID="mapContainer">
            <View style={styles.map}>
                <ZoomableView
                    ref={refZoom}
                    contentWidth={map.Image.Width}
                    contentHeight={map.Image.Height}
                    maxZoom={maxZoom}
                    minZoom={minZoom}
                    zoomStep={maxZoom - minZoom}
                    initialZoom={entry ? (minZoom + maxZoom) / 2 : minZoom}
                    bindToBorders={true}
                    onTransform={onTransform}
                >
                    <View style={styleContainer}>
                        <Image style={styles.image} allowDownscaling={false} contentFit={undefined} source={sourceFromImage(map.Image)} priority="high" />
                        {!entry ? null : <Marker style={styleMarker} markerSize={75} />}
                    </View>
                </ZoomableView>
            </View>
            {!map?.Entries?.length ? null : (
                <BottomSheet ref={refSheet} backgroundStyle={styleBackground} handleStyle={styles.handle} handleIndicatorStyle={styleHandle} snapPoints={[170, "75%"]} index={0}>
                    <MapContentFlatList
                        initialNumToRender={2}
                        maxToRenderPerBatch={1}
                        ListHeaderComponent={header}
                        windowSize={5}
                        data={results}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        contentContainerStyle={styles.mapContentContainer}
                    />
                </BottomSheet>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    handle: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    map: {
        flex: 1,
        marginBottom: 190,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    mapContentContainer: {
        paddingHorizontal: 15,
    },
});
