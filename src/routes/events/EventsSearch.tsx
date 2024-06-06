import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useIsFocused } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { EventsRouterParamsList } from "./EventsRouter";
import { useEventsRouterContext } from "./EventsRouterContext";
import { Label } from "../../components/generic/atoms/Label";
import { Button } from "../../components/generic/containers/Button";
import { Floater } from "../../components/generic/containers/Floater";
import { Row } from "../../components/generic/containers/Row";
import { Tab } from "../../components/generic/containers/Tab";
import { useThemeBackground, useThemeMemo } from "../../hooks/themes/useThemeHooks";
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
    const { t } = useTranslation("Events");
    const { search, setSearch, results } = useEventsRouterContext();

    // Hide keyboard on navigating away from this page.
    const isFocused = useIsFocused();
    useEffect(() => {
        if (!isFocused) Keyboard.dismiss();
    }, [isFocused]);

    const onDay = useCallback(() => navigation.getParent()?.setParams({ filterType: "days" }), [navigation]);
    const onRoom = useCallback(() => navigation.getParent()?.setParams({ filterType: "rooms" }), [navigation]);
    const onTrack = useCallback(() => navigation.getParent()?.setParams({ filterType: "tracks" }), [navigation]);

    const searchStyle = useThemeMemo((theme) => ({ color: theme.text, borderBottomColor: theme.text }));
    const roundedStyle = useThemeBackground("secondary");
    return (
        <Floater>
            <View style={styles.end}>
                <View style={styles.searchArea}>
                    <Label type="caption">Enter your query</Label>
                    <TextInput style={[styles.searchField, searchStyle]} value={search} onChangeText={setSearch} placeholder="Enter query" />

                    {!results ? null : <Button onPress={() => navigation.jumpTo("Results")}>View all {results.length} results</Button>}
                </View>
                <Row style={styles.categories} type="stretch" variant="spaced">
                    <Tab style={[styles.rounded, roundedStyle]} inverted icon="calendar-outline" text={t("filter_by_day")} onPress={onDay} />
                    <Tab style={[styles.rounded, styles.rowCenter, roundedStyle]} inverted icon="bus-stop" text={t("filter_by_track")} onPress={onTrack} />
                    <Tab style={[styles.rounded, roundedStyle]} inverted icon="office-building" text={t("filter_by_room")} onPress={onRoom} />
                </Row>
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
    },
    searchArea: {
        height: 160,
    },
    searchField: {
        paddingVertical: 5,
        borderBottomWidth: 1,
        marginVertical: 25,
    },
    rounded: {
        margin: 10,
        borderRadius: 10,
    },
    rowCenter: {
        marginHorizontal: 8,
    },
});
