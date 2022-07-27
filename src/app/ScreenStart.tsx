import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

import { conId } from "../configuration";
import { useThemeType } from "../context/Theme";
import { useNavigationStatePersistence } from "../hooks/useNavigationStatePersistence";
import { CommunicationRecord, RecordId } from "../store/eurofurence.types";
import { AboutScreen } from "./About";
import { ScreenEmptyParams } from "./Common/ScreenEmpty";
import { DealerScreen, DealerScreenParams } from "./Dealers/DealerScreen";
import { DealersTabsScreenParamsList } from "./Dealers/DealersTabsScreen";
import { EventScreen } from "./Events/EventScreen";
import { EventsTabsScreenParamsList } from "./Events/EventsTabsScreen";
import { KnowledgeEntryScreen } from "./Knowledge/KnowledgeEntryScreen";
import { KnowledgeGroupsScreen } from "./Knowledge/KnowledgeGroupsScreen";
import { MapScreen } from "./Maps/MapScreen";
import { PrivateMessageItemScreen } from "./PrivateMessages/PrivateMessageItemScreen";
import { PrivateMessageListScreen } from "./PrivateMessages/PrivateMessageListScreen";
import { ScreenAreas, ScreenAreasParams, ScreenAreasParamsList } from "./ScreenAreas";
import { SettingsScreen } from "./Settings/SettingsScreen";

/**
 * Available routes.
 */
export type ScreenStartParamsList = {
    /**
     * Primary areas.
     */
    Areas: ScreenAreasParams;

    /**
     * Detail screen for events.
     */
    Event: {
        id: string;
    };

    /**
     * Detail screen for dealer.
     */
    Dealer: DealerScreenParams;
    Settings: ScreenEmptyParams;
    PrivateMessageList: ScreenEmptyParams;
    PrivateMessageItem: {
        id: RecordId;
        message: CommunicationRecord;
    };
    KnowledgeGroups: object;
    KnowledgeEntry: {
        id: RecordId;
    };
    Map: {
        id: RecordId;
    };
    About: undefined;
};

const ScreenStartNavigator = createStackNavigator<ScreenStartParamsList>();

type LinkingConfig<ParamsList> = {
    initialRouteName?: keyof ParamsList;
    screens: Record<keyof ParamsList, string | LinkingConfig<any>>;
    path?: string;
    exact?: boolean;
    parse?: Record<string, (value: string) => any>;
    stringify?: Record<string, (value: any) => string>;
};

// TODO: @lukashaertel With this config I can deeplink to predefined items in the events screen but never to any details
const eventsLinking: LinkingConfig<EventsTabsScreenParamsList> = {
    initialRouteName: "Events",
    screens: {
        Favorites: "Areas/Events/Favorites",
        Results: "Areas/Events/Results",
        Search: "Areas/Events/Search",
    },
};

const dealersLinking: LinkingConfig<DealersTabsScreenParamsList> = {
    initialRouteName: "All",
    screens: {
        All: "Areas/Dealers",
        Thu: "Areas/Dealers/Thu",
        Fri: "Areas/Dealers/Fri",
        Sat: "Areas/Dealers/Sat",
    },
};
const areasLinking: LinkingConfig<ScreenAreasParamsList> = {
    initialRouteName: "Home",
    screens: {
        Home: "Areas/Home",
        Events: eventsLinking,
        Dealers: dealersLinking,
    },
};

/**
 * Configure deep linking
 */
const linking: LinkingOptions<ScreenStartParamsList> = {
    prefixes: [Linking.createURL(`/`), Linking.createURL(`/${conId}/Web/`), `https://app.eurofurence.org`],
    config: {
        initialRouteName: "Areas",
        screens: {
            Areas: areasLinking,
            Event: "Events/:id",
            Dealer: "Dealers/:id",
            KnowledgeGroups: "Knowledge",
            KnowledgeEntry: "Knowledge/:id",
            Settings: "Settings",
            Map: "Map/:id",
            About: "About",
        },
    } as any,
};

/**
 * The properties to the screen as a component. This does not have navigator properties, as it
 * is the node initially providing the navigation container.
 */
export type ScreenStartProps = object;

export const ScreenStart: FC<ScreenStartProps> = () => {
    // Get the theme type for status bar configuration.
    const themeType = useThemeType();

    // Get navigation state from persistence.
    const [isReady, initialState, onStateChange] = useNavigationStatePersistence();

    // If not yet loaded, skip rendering.
    if (!isReady) {
        return null;
    }

    return (
        <NavigationContainer linking={linking} initialState={initialState} onStateChange={onStateChange}>
            <StatusBar style={themeType === "light" ? "dark" : "light"} />

            <View style={[StyleSheet.absoluteFill, { backgroundColor: "green" }]}>
                <ScreenStartNavigator.Navigator screenOptions={{ headerShown: false }}>
                    <ScreenStartNavigator.Screen name="Areas" component={ScreenAreas} />
                    <ScreenStartNavigator.Screen name="Event" component={EventScreen} />
                    <ScreenStartNavigator.Screen name="Dealer" component={DealerScreen} />
                    <ScreenStartNavigator.Screen name="Settings" component={SettingsScreen} />
                    <ScreenStartNavigator.Screen name="PrivateMessageList" component={PrivateMessageListScreen} />
                    <ScreenStartNavigator.Screen name="PrivateMessageItem" component={PrivateMessageItemScreen} />
                    <ScreenStartNavigator.Screen name="KnowledgeGroups" component={KnowledgeGroupsScreen} />
                    <ScreenStartNavigator.Screen name="KnowledgeEntry" component={KnowledgeEntryScreen} />
                    <ScreenStartNavigator.Screen name="Map" component={MapScreen} />
                    <ScreenStartNavigator.Screen name="About" component={AboutScreen} />
                </ScreenStartNavigator.Navigator>
            </View>
        </NavigationContainer>
    );
};
