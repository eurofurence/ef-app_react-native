import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import { FC, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { EventsRouterParamsList } from "./EventsRouter";
import { useEventsRouterContext } from "./EventsRouterContext";
import { eventInstanceForAny } from "../../components/app/events/EventCard";
import { EventsList } from "../../components/app/events/EventsList";
import { Section } from "../../components/generic/atoms/Section";
import { Button } from "../../components/generic/containers/Button";
import { useNow } from "../../hooks/time/useNow";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type EventsResultsParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type EventsResultsProps =
    // Route carrying from events tabs screen at "Results", own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<EventsRouterParamsList, "Results">,
        MaterialTopTabScreenProps<EventsRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const EventsResults: FC<EventsResultsProps> = ({ navigation }) => {
    const { search, setSearch, results, setSelected } = useEventsRouterContext();

    const onClear = useCallback(() => {
        setSearch("");
        navigation.jumpTo("Search");
    }, [setSearch, navigation]);

    const [now] = useNow();
    const events = useMemo(
        () =>
            chain(results)
                .orderBy("StartDateTimeUtc")
                .map((details) => eventInstanceForAny(details, now))
                .value(),
        [results, now],
    );

    return (
        <EventsList
            navigation={navigation}
            events={events}
            select={setSelected}
            cardType="time"
            leader={
                <View style={styles.leader}>
                    <Section icon="view-list" title={search} subtitle={`${results?.length} results in total`} />
                    <Button icon="chevron-left" onPress={onClear}>
                        Clear search
                    </Button>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    leader: {
        paddingBottom: 30,
    },
});
