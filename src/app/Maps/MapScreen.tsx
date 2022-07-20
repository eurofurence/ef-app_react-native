import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { useRoute } from "@react-navigation/core";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useRef } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { Label } from "../../components/Atoms/Label";
import { Header } from "../../components/Containers/Header";
import { useAppSelector } from "../../store";
import { imagesSelectors, mapsSelectors } from "../../store/eurofurence.selectors";
import { EnrichedImageRecord, EnrichedMapRecord, RecordId } from "../../store/eurofurence.types";
import { LinkItem } from "./LinkItem";

export type MapScreenParams = {
    id: RecordId;
};

export const MapScreen = () => {
    const sheetRef = useRef<BottomSheet>();
    const route = useRoute<Route<MapScreenParams, "Map">>();

    const map = useAppSelector((state): EnrichedMapRecord | undefined => mapsSelectors.selectById(state, route.params.id));
    const image = useAppSelector((state): EnrichedImageRecord | undefined => (map?.ImageId ? imagesSelectors.selectById(state, map?.ImageId) : undefined));
    const entries = useMemo(
        () =>
            map?.Entries
                ? map.Entries.map((it) => ({
                      title: it.Id,
                      data: it.Links.map((link) => ({
                          ...link,
                          id: it.Id + link.Target,
                      })),
                  }))
                : ([] as const),
        [map]
    );

    useEffect(() => {
        if (isEmpty(entries)) {
            sheetRef.current?.close();
        } else {
            sheetRef.current?.snapToPosition(0);
        }
    }, [entries]);

    if (map === undefined || image === undefined) {
        return <Text>Nothing here but the bees . . .</Text>;
    }

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header>{map.Description}</Header>
            <Animated.Image
                source={{
                    uri: map.ImageUrl,
                }}
                resizeMode={"contain"}
                style={{
                    flexGrow: 1,
                }}
            />
            <BottomSheet snapPoints={["10%", "75%"]} index={0} ref={sheetRef}>
                <BottomSheetSectionList
                    sections={entries}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <LinkItem link={item} />}
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                />
            </BottomSheet>
        </View>
    );
};
