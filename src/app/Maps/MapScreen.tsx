import * as React from "react";
import { useMemo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useSentryProfiler } from "../../sentryHelpers";
import { useAppSelector } from "../../store";
import { mapsSelectors } from "../../store/eurofurence.selectors";
import { appStyles } from "../AppStyles";
import { MapContent, MapContentProps } from "./MapContent";

export const MapScreen = () => {
    // Get safe area and route.
    useSentryProfiler("MapScreen");
    const safe = useSafeAreaInsets();
    const route = useAppRoute("Map");

    // Resolve map.
    const map = useAppSelector((state) => mapsSelectors.selectById(state, route.params.id));

    // Resolve entry if requested.
    const entry = useMemo(() => {
        if (!map) return;
        if (!route.params.entryId) return;
        return map.Entries.find((item) => item.Id === route.params.entryId);
    }, [map, route]);

    return (
        <View style={[appStyles.abs, safe]}>
            <Header>{map?.Description ?? "Viewing map"}</Header>
            {!map?.Image || (route.params.entryId && !entry) ? null : <MapContent map={map as MapContentProps["map"]} entry={entry} />}
        </View>
    );
};
