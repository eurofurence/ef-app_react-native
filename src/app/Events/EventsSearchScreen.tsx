import { CompositeScreenProps, useIsFocused } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useCallback, useContext, useEffect, useMemo } from "react";
import { Keyboard, StyleSheet, Text, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { Button } from "../../components/Containers/Button";
import { Floater } from "../../components/Containers/Floater";
import { Row } from "../../components/Containers/Row";
import { Tab } from "../../components/Containers/Tab";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { useTheme } from "../../context/Theme";
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

    const theme = useTheme();
    const border = useMemo<ViewStyle>(() => ({ borderBottomColor: theme.text }), [theme]);
    return (
        <Floater>
            <View style={styles.end}>
                <Row style={[styles.categories, border]}>
                    <Tab icon="calendar-outline" text="Filter by day" onPress={onDay} />
                    <Tab icon="bus-outline" text="Filter by track" onPress={onTrack} />
                    <Tab icon="business-outline" text="Filter by room" onPress={onRoom} />
                </Row>
                <View style={styles.searchArea}>
                    <Text>Enter your query</Text>
                    <TextInput style={[styles.searchField, border]} value={search} onChangeText={setSearch} placeholder="Enter query" />

                    {!results ? null : <Button onPress={() => navigation.jumpTo("Results")}>View all {results.length} results</Button>}
                </View>
            </View>
        </Floater>
    );
};

const styles = StyleSheet.create({
    end: {
        justifyContent: "flex-end",
        flex: 1,
    },
    categories: {
        paddingBottom: 20,
        marginBottom: 30,
        borderBottomWidth: 1,
    },
    searchArea: {
        height: 160,
    },
    searchField: {
        paddingVertical: 5,
        borderBottomWidth: 1,
        marginVertical: 25,
    },
});
