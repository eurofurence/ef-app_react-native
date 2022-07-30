import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { NavigationState } from "@react-navigation/routers";
import * as Linking from "expo-linking";
import { FC, useCallback } from "react";

import { DealersTabsScreenParamsList } from "../app/Dealers/DealersTabsScreen";
import { EventsTabsScreenParamsList } from "../app/Events/EventsTabsScreen";
import { ScreenAreasParamsList } from "../app/ScreenAreas";
import { ScreenStartParamsList } from "../app/ScreenStart";
import { conId } from "../configuration";
import { useAnalytics } from "../hooks/useAnalytics";
import { useNavigationStatePersistence } from "../hooks/useNavigationStatePersistence";

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

export const NavigationProvider: FC = ({ children }) => {
    // Get navigation state from persistence.
    const [isReady, initialState, onStateChange] = useNavigationStatePersistence();
    const logEvent = useAnalytics();

    const logAnalytics = useCallback(
        (state: NavigationState | undefined) => {
            if (!state) return null;
            const route: { name: string; params?: object; key: string } = state.routes[state.index] as any;

            logEvent("screen_view", {
                screen_name: route.name,
                ...route.params,
            });
        },
        [logEvent]
    );

    if (!isReady) {
        return null;
    }
    return (
        <NavigationContainer
            linking={linking}
            initialState={initialState}
            onStateChange={(state) => {
                onStateChange(state);
                logAnalytics(state);
            }}
        >
            {children}
        </NavigationContainer>
    );
};
