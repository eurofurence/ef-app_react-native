import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FC, MutableRefObject, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { MainMenu } from "../app/MainMenu/MainMenu";
import { PagerLogin } from "../app/MainMenu/PagerLogin";
import { PagerPrimary } from "../app/MainMenu/PagerPrimary";
import { Label } from "../components/Atoms/Label";
import { AuthorizationOverview } from "../components/Authorization/AuthorizationOverview";
import { Button } from "../components/Containers/Button";
import { Pager } from "../components/Containers/Pager";
import { Pages } from "../components/Containers/Pages";
import { Tabs, TabsRef } from "../components/Containers/Tabs";
import { createPagedNavigator } from "../components/Navigators/PagedNavigator";
import { createTabNavigator } from "../components/Navigators/TabsNavigator";
import { LoadingIndicator } from "../components/Utilities/LoadingIndicator";
import { useTheme } from "../context/Theme";
import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/authorization.slice";
import { useGetAnnouncementsQuery, useGetDealersQuery, useGetEventByIdQuery, useGetEventsQuery } from "../store/eurofurence.service";
import { AnnouncementRecord, EnrichedDealerRecord, EventRecord } from "../store/eurofurence.types";

const MainNavigator = createStackNavigator();

const AreasNavigator = createTabNavigator();

const PagesNavigator = createPagedNavigator();

const NoScreen = ({ navigation, route }) => {
    return (
        <View style={{ padding: 30 }}>
            <Label type="h1">{route.name}</Label>
            <Label type="h2">Screen not implemented yet</Label>
        </View>
    );
};

const EventsScreen = ({ navigation, route }) => {
    return (
        <PagesNavigator.Navigator>
            <PagesNavigator.Screen name="Mon" component={NoScreen} />
            <PagesNavigator.Screen name="Tue" component={NoScreen} />
            <PagesNavigator.Screen name="Wed" component={NoScreen} />
            <PagesNavigator.Screen name="Thu" component={NoScreen} />
            <PagesNavigator.Screen name="Fri" component={NoScreen} />
        </PagesNavigator.Navigator>
    );
};

const HomeScreen = ({ navigation, route }) => {
    // const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const announcements: Query<AnnouncementRecord[]> = useGetAnnouncementsQuery();

    const theme = useTheme();

    const events: Query<EventRecord[]> = useGetEventsQuery();
    const event: Query<EventRecord, string> = useGetEventByIdQuery("76430fe0-ece7-48c9-b8e6-fdbc3974ff64");
    const dealers: Query<EnrichedDealerRecord[]> = useGetDealersQuery();

    return (
        <View style={{ padding: 30 }}>
            {announcements.isFetching ? <LoadingIndicator /> : <Label mb={15}>There are {announcements.data?.length} announcements</Label>}
            {events.isFetching ? <LoadingIndicator /> : <Label mb={15}>There are {events.data?.length} events</Label>}
            {event.isFetching ? <LoadingIndicator /> : <Label mb={15}>We have retrieved event {event.data?.Title ?? "..."}</Label>}
            {dealers.isFetching ? <LoadingIndicator /> : <Label mb={15}>We have {dealers.data?.length ?? "..."} dealers</Label>}
            <Button onPress={() => dispatch(logout())}>Log-out</Button>

            {/* Theme verifier. */}
            <View style={{ marginTop: 30, flexDirection: "row", flexWrap: "wrap" }}>
                {Object.entries(theme).map(([name, color]) => (
                    <Text key={name} style={{ width: 150, height: 50, backgroundColor: color, padding: 15 }}>
                        {name}
                    </Text>
                ))}
            </View>

            {/* Label style verifier. */}
            <View style={{ backgroundColor: theme.background, alignSelf: "stretch", padding: 30 }}>
                <Label type="h1">Heading 1</Label>
                <Label type="h2">Heading 2</Label>
                <Label type="h3">Heading 3</Label>
                <Label type="h4">Heading 4</Label>
                <Label type="span">Span</Label>
                <Label type="span" color="important">
                    Important span
                </Label>
            </View>
        </View>
    );
};
const AreasScreen = ({ navigation, route }) => (
    <AreasNavigator.Navigator screenOptions={{ more: (tabs: MutableRefObject<TabsRef | undefined>) => <MainMenu tabs={tabs} /> }}>
        <AreasNavigator.Screen name="Home" options={{ icon: "home" }} component={HomeScreen} />
        <AreasNavigator.Screen name="Events" options={{ icon: "calendar" }} component={EventsScreen} />
        <AreasNavigator.Screen name="Dealers" options={{ icon: "cart-outline" }} component={NoScreen} />
    </AreasNavigator.Navigator>
);
export const StartScreen = () => {
    return (
        <NavigationContainer>
            <View style={StyleSheet.absoluteFill}>
                <MainNavigator.Navigator screenOptions={{ headerShown: false }}>
                    <MainNavigator.Screen name="Default" component={AreasScreen} />
                </MainNavigator.Navigator>
            </View>
        </NavigationContainer>
    );
};
