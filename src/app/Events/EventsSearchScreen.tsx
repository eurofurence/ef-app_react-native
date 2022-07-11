import { CompositeScreenProps, useIsFocused } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useCallback, useContext, useEffect } from "react";
import { Text, View, Keyboard } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { Button } from "../../components/Containers/Button";
import { Floater } from "../../components/Containers/Floater";
import { Row } from "../../components/Containers/Row";
import { Tab } from "../../components/Containers/Tab";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsSearchContext } from "./EventsSearchContext";
import { EventsTabsScreenNavigatorParamsList } from "./EventsTabsScreen";

/**
 * Params handled by the screen in route.
 */
export type EventsSearchScreenParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type EventsSearchScreenProps = CompositeScreenProps<PagesScreenProps<EventsTabsScreenNavigatorParamsList, any>, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const EventsSearchScreen: FC<EventsSearchScreenProps> = ({ navigation }) => {
    const { search, setSearch, results } = useContext(EventsSearchContext);

    // Hide keyboard on navigating away from this page.
    const isFocused = useIsFocused();
    useEffect(() => {
        if (!isFocused) Keyboard.dismiss();
    }, [isFocused]);

    const onDay = useCallback(() => navigation.getParent()?.setParams({ filterType: "days" }), [navigation]);
    const onRoom = useCallback(() => navigation.getParent()?.setParams({ filterType: "rooms" }), [navigation]);
    const onTrack = useCallback(() => navigation.getParent()?.setParams({ filterType: "tracks" }), [navigation]);

    return (
        <Floater>
            <View style={{ justifyContent: "flex-end", flex: 1 }}>
                <Row style={{ marginBottom: 30 }}>
                    <Tab icon="calendar-outline" text="Filter by day" onPress={onDay} />
                    <Tab icon="bus-outline" text="Filter by track" onPress={onTrack} />
                    <Tab icon="business-outline" text="Filter by room" onPress={onRoom} />
                </Row>
                <View style={{ height: 200 }}>
                    <Text>Enter your query</Text>
                    <TextInput style={{ paddingVertical: 15, marginVertical: 15 }} value={search} onChangeText={setSearch} placeholder="Enter query" />

                    {!results ? null : <Button onPress={() => navigation.jumpTo("Results")}>View all {results.length} results</Button>}
                </View>
            </View>
        </Floater>
    );
};
