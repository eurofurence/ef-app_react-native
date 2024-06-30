import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { useEventSearchGroups } from "./Events.common";
import { EventsRouterParamsList } from "./EventsRouter";
import { useEventsRouterContext } from "./EventsRouterContext";
import { EventsSectionedList } from "../../components/events/EventsSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { Search } from "../../components/generic/atoms/Search";
import { Row } from "../../components/generic/containers/Row";
import { Tab } from "../../components/generic/containers/Tab";
import { useFuseIntegration } from "../../hooks/searching/useFuseIntegration";
import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { useNow } from "../../hooks/time/useNow";
import { selectEventsAllSearchIndex } from "../../store/eurofurence/selectors/search";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type EventsSearchParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type EventsSearchProps =
    // Route carrying from events tabs screen at "Search", own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<EventsRouterParamsList, "Search">,
        MaterialTopTabScreenProps<EventsRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const EventsSearch: FC<EventsSearchProps> = ({ navigation }) => {
    // General state.
    const { t } = useTranslation("Events");
    const now = useNow();

    const { setSelected } = useEventsRouterContext();

    // Search state.
    const [filter, setFilter, results] = useFuseIntegration(selectEventsAllSearchIndex);

    // Use results and group generically.
    const eventGroups = useEventSearchGroups(t, now, results);

    // Actions
    const onDay = useCallback(() => navigation.getParent()?.setParams({ filterType: "days" }), [navigation]);
    const onRoom = useCallback(() => navigation.getParent()?.setParams({ filterType: "rooms" }), [navigation]);
    const onTrack = useCallback(() => navigation.getParent()?.setParams({ filterType: "tracks" }), [navigation]);

    const roundedStyle = useThemeBackground("secondary");
    return (
        <EventsSectionedList
            navigation={navigation}
            eventsGroups={eventGroups}
            select={setSelected}
            leader={
                <>
                    <Label type="lead" variant="middle" mt={30}>
                        {t("search")}
                    </Label>
                    <Row style={styles.row} type="stretch" variant="spaced">
                        <Tab style={[styles.rounded, roundedStyle]} inverted icon="calendar-outline" text={t("filter_by_day")} onPress={onDay} />
                        <Tab style={[styles.rounded, styles.rowCenter, roundedStyle]} inverted icon="bus-stop" text={t("filter_by_track")} onPress={onTrack} />
                        <Tab style={[styles.rounded, roundedStyle]} inverted icon="office-building" text={t("filter_by_room")} onPress={onRoom} />
                    </Row>
                    <Search filter={filter} setFilter={setFilter} />
                </>
            }
            cardType="time"
        />
    );
};

const styles = StyleSheet.create({
    row: {
        marginTop: 15,
    },
    end: {
        justifyContent: "flex-end",
        flex: 1,
    },
    searchArea: {
        height: 160,
    },
    searchField: {
        borderBottomWidth: 1,
        marginVertical: 25,
        borderRadius: 10,
        padding: 10,
        flex: 1,
    },
    rounded: {
        margin: 10,
        borderRadius: 10,
    },
    rowCenter: {
        marginHorizontal: 8,
    },
});
