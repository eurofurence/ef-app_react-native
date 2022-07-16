import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import { FC, useCallback, useMemo } from "react";
import { View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { useEventsSearchContext } from "../../components/Searching/EventsSearchContext";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsListGeneric } from "./EventsListGeneric";
import { EventsTabsScreenNavigatorParamsList } from "./EventsTabsScreen";

/**
 * Params handled by the screen in route.
 */
export type EventsListSearchResultsScreenParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type EventsListSearchResultsScreenProps = CompositeScreenProps<PagesScreenProps<EventsTabsScreenNavigatorParamsList, any>, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const EventsListSearchResultsScreen: FC<EventsListSearchResultsScreenProps> = ({ navigation }) => {
    const { search, setSearch, results } = useEventsSearchContext();

    const onClear = useCallback(() => {
        setSearch("");
        navigation.jumpTo("Search");
    }, [setSearch, navigation]);

    const events = useMemo(() => (!results ? [] : chain(results).orderBy("StartDateTimeUtc").value()), []);

    return (
        <EventsListGeneric
            navigation={navigation}
            events={events}
            cardType="time"
            leader={
                <View style={{ paddingBottom: 30 }}>
                    <Section icon="view-list" title={search} subtitle={`${results?.length} results in total`} />
                    <Button icon="chevron-left" onPress={onClear}>
                        Clear search
                    </Button>
                </View>
            }
        />
    );
};
