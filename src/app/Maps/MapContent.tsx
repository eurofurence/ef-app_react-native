import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { ReactNativeZoomableView as ZoomableView, ZoomableViewEvent } from "@openspacelabs/react-native-zoomable-view";
import { chain, clamp } from "lodash";
import * as React from "react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Platform, StyleSheet, View, ViewStyle } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Marker } from "../../components/Atoms/Marker";
import { ImageDetails, MapDetails, MapEntryDetails } from "../../store/eurofurence.types";
import { LinkItem } from "./LinkItem";

const circleTouches = (x1: number, y1: number, x2: number, y2: number, x: number, y: number, r: number) => {
    const ix = clamp(x, x1, x2);
    const iy = clamp(y, y1, y2);
    return Math.hypot(ix - x, iy - y) < r;
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

    const [results, setResults] = useState<MapEntryDetails[]>(map.Entries);
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

            // Filter all that touch the view.
            setResults(
                chain(map?.Entries)
                    .filter((entry) => circleTouches(x1, y1, x2, y2, entry.X, entry.Y, entry.TapRadius))
                    .orderBy((entry) => Math.hypot(entry.X - centerX, entry.Y - centerY), "asc")
                    .value()
            );
        }, 350);
    }, []);

    useEffect(() => {
        if (!refSheet.current) return;
        if (entry) refSheet.current.collapse();
    }, [entry]);

    const sections = useMemo(
        () =>
            results.map((entry, i) => ({
                title: `${entry.Id}/${i}`,
                data: entry.Links.map((link) => ({ map, entry, link })),
            })),
        [results]
    );

    // TODO: I cannot figure out how to get the target offset from the entry.
    // useEffect(() => {
    //     if (!entry) return;
    //     const handle = setTimeout(() => {
    //         if (!ref.current) return;
    //         ref.current._zoomToLocation(entry.X * zoom, entry.Y * zoom, 1).catch(() => undefined);
    //     }, 1000);
    //     return () => clearTimeout(handle);
    // }, [entry, ref, zoom, sourceWidth, sourceHeight]);

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
                    initialZoom={minZoom}
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
                        <BottomSheetSectionList
                            initialNumToRender={2}
                            maxToRenderPerBatch={1}
                            sections={sections}
                            keyExtractor={(item, i) => `${item.map.Id}/${item.entry.Id}:${i}`}
                            renderItem={({ item }) => <LinkItem map={item.map} entry={item.entry} link={item.link} />}
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
