import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import { FC, useCallback, useMemo } from "react";
import { View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";
import { EventsListGeneric } from "./EventsListGeneric";
import { useEventsTabsContext } from "./EventsTabsContext";
import { EventsTabsScreenParamsList } from "./EventsTabsScreen";

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
        PagesScreenProps<EventsTabsScreenParamsList, "Results">,
        PagesScreenProps<EventsTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

export const EventsListSearchResultsScreen: FC<EventsListSearchResultsScreenProps> = ({ navigation }) => {
    const { search, setSearch, results, setSelected } = useEventsTabsContext();

    const onClear = useCallback(() => {
        setSearch("");
        navigation.jumpTo("Search");
    }, [setSearch, navigation]);

    const events = useMemo(() => chain(results).orderBy("StartDateTimeUtc").value(), []);

    return (
        <EventsListGeneric
            navigation={navigation}
            events={events}
            select={setSelected}
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
