import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { ReactNativeZoomableView as ZoomableView, ZoomableViewEvent } from "@openspacelabs/react-native-zoomable-view";
import { chain, clamp } from "lodash";
import * as React from "react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Platform, StyleSheet, View, ViewStyle } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Marker } from "../../components/Atoms/Marker";
import { ImageDetails, LinkFragment, MapDetails, MapEntryDetails } from "../../store/eurofurence.types";
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
};

export const MapContent: FC<MapContentProps> = ({ map, entry }) => {
    const { t } = useTranslation("Maps");
    const refHandle = useRef<any>([0, 0]);
    const refZoom = useRef<ZoomableView>(null);
    const refSheet = useRef<BottomSheet>(null);

    const [results, setResults] = useState<FilterResult[]>([]);
    const onTransform = useCallback((event: ZoomableViewEvent) => {
        clearTimeout(refHandle.current);

        refHandle.current = setTimeout(() => {
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
            setResults(
                chain(map?.Entries)
                    .filter((entry) => circleTouches(x1, y1, x2, y2, entry.X, entry.Y, entry.TapRadius))
                    .orderBy((entry) => distSq(entry.X - centerX, entry.Y - centerY), "asc")
                    .flatMap((entry) => entry.Links.map((link, i) => ({ key: `${map.Id}/${entry.Id}#${i}`, map, entry, link })))
                    .value()
            );
        }, 350);
    }, []);

    useEffect(() => {
        if (!refSheet.current) return;
        if (entry) refSheet.current.collapse();
    }, [entry]);

    // On change of entry, move to new location.
    useEffect(() => {
        if (!entry) return;
        if (!refZoom.current) return;
        // Get arguments from current status..
        const current = refZoom.current._getZoomableViewEventObject();
        const offsetX = current.offsetX;
        const offsetY = current.offsetY;
        const zoom = current.zoomLevel;

        // Get change to current center.
        const diffX = entry.X - (map.Image.Width / 2 - offsetX);
        const diffY = entry.Y - (map.Image.Height / 2 - offsetY);
        refZoom.current.moveBy(diffX * zoom, diffY * zoom).catch(() => undefined);
    }, [entry, refZoom]);

    // Compute containers.
    const styleContainer = useMemo<ViewStyle>(() => ({ width: map.Image.Width, height: map.Image.Height }), [map]);
    const styleMarker = useMemo<ViewStyle>(() => (!entry ? { display: "none" } : { left: entry.X, top: entry.Y }), [entry]);

    const [minZoom, maxZoom] = useMemo(() => (Math.max(map.Image.Width, map.Image.Height) < 2048 ? [0.5, 2] : [0.25, 1]), [map]);
    return (
        <>
            <View style={styles.container}>
                <ZoomableView
                    ref={refZoom}
                    contentWidth={map.Image.Width}
                    contentHeight={map.Image.Height}
                    maxZoom={maxZoom}
                    minZoom={minZoom}
                    zoomStep={maxZoom - minZoom}
                    initialZoom={entry ? 1.5 : minZoom}
                    bindToBorders={true}
                    onTransform={onTransform}
                >
                    <View style={styleContainer}>
                        <Image style={styles.image} resizeMode={undefined} source={{ uri: map.Image.FullUrl }} />
                        {!entry ? null : <Marker style={styleMarker} markerSize={75} />}
                    </View>
                </ZoomableView>
            </View>

            {/*Apparently we cannot render this in a browser*/}
            {Platform.OS === "web" ? null : (
                <BottomSheet ref={refSheet} snapPoints={["10%", "75%"]} index={0}>
                    {!results ? (
                        <Label mt={15} type="em" variant="middle">
                            {t("filtering")}
                        </Label>
                    ) : (
                        <BottomSheetFlatList
                            initialNumToRender={2}
                            maxToRenderPerBatch={1}
                            data={results}
                            keyExtractor={({ key }) => key}
                            renderItem={({ item: { map, entry, link } }) => <LinkItem map={map} entry={entry} link={link} />}
                            contentContainerStyle={{ paddingHorizontal: 15 }}
                        />
                    )}
                </BottomSheet>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: "10%",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});
