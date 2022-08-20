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

    const link = useMemo(() => {
        if (!entry) return;
        if (typeof route.params.linkId !== "number") return;
        return entry.Links[route.params.linkId];
    }, [entry, route]);

    const title = useMemo(() => {
        if (map?.Description) {
            if (link?.Name) return `${map.Description}: ${link.Name}`;
            else return map.Description;
        } else {
            return "Viewing map";
        }
    }, [map, link]);

    return (
        <View style={[appStyles.abs, safe]}>
            <Header>{title}</Header>
            {!map?.Image || (route.params.entryId && !entry) || (route.params.linkId && !link) ? null : (
                <MapContent map={map as MapContentProps["map"]} entry={entry} link={link} />
            )}
        </View>
    );
};
