import { useProfiler } from "@sentry/react-native";
import * as React from "react";
import { useMemo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../../components/app/AppStyles";
import { MapContent, MapContentProps } from "../../components/app/maps/MapContent";
import { Header } from "../../components/generic/containers/Header";
import { useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { mapsSelectors } from "../../store/eurofurence.selectors";

export const Map = () => {
    // Get safe area and route.
    useProfiler("Map");
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
