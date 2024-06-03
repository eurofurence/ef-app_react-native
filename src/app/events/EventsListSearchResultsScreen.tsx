import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import { FC, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { useEventsTabsContext } from "./EventsTabsContext";
import { EventsTabsScreenParamsList } from "./EventsTabsScreen";
import { EventsListGeneric } from "../../components/app/events/EventsListGeneric";
import { Section } from "../../components/generic/atoms/Section";
import { Button } from "../../components/generic/containers/Button";
import { TabScreenProps } from "../../components/generic/nav/TabsNavigator";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";

/**
 * Params handled by the screen in route.
 */
export type EventsListSearchResultsScreenParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type EventsListSearchResultsScreenProps =
    // Route carrying from events tabs screen at "Results", own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<EventsTabsScreenParamsList, "Results">,
        MaterialTopTabScreenProps<EventsTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

export const EventsListSearchResultsScreen: FC<EventsListSearchResultsScreenProps> = ({ navigation }) => {
    const { search, setSearch, results, setSelected } = useEventsTabsContext();

    const onClear = useCallback(() => {
        setSearch("");
        navigation.jumpTo("Search");
    }, [setSearch, navigation]);

    const events = useMemo(() => chain(results).orderBy("StartDateTimeUtc").value(), []);

    const leader = useMemo(() => {
        return (
            <View style={styles.leader}>
                <Section icon="view-list" title={search} subtitle={`${results?.length} results in total`} />
                <Button icon="chevron-left" onPress={onClear}>
                    Clear search
                </Button>
            </View>
        );
    }, [search, results, onClear]);

    return <EventsListGeneric navigation={navigation} events={events} select={setSelected} cardType="time" leader={leader} />;
};

const styles = StyleSheet.create({
    leader: {
        paddingBottom: 30,
    },
});
