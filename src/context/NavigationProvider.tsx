import { LinkingOptions, NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { NavigationState } from "@react-navigation/routers";
import { captureException, ReactNavigationInstrumentation } from "@sentry/react-native";
import { FC, PropsWithChildren, useCallback, useMemo, useRef } from "react";

import { DealersTabsScreenParamsList } from "../app/Dealers/DealersTabsScreen";
import { EventsTabsScreenParamsList } from "../app/Events/EventsTabsScreen";
import { ScreenAreasParamsList } from "../app/ScreenAreas";
import { ScreenStartParamsList } from "../app/ScreenStart";
import { conId } from "../configuration";
import { useAnalytics } from "../hooks/analytics/useAnalytics";
import { useNavigationStatePersistence } from "../hooks/nav/useNavigationStatePersistence";
import { useTheme, useThemeName } from "../hooks/themes/useThemeHooks";
import { useAppSelector } from "../store";
import { eventDaysSelectors, eventRoomsSelectors, eventTracksSelectors } from "../store/eurofurence.selectors";
import { RecordId } from "../store/eurofurence.types";

export const sentryRoutingInstrumentation = new ReactNavigationInstrumentation();

type LinkingConfig<ParamsList> = {
    initialRouteName?: keyof ParamsList;
    screens: Record<keyof ParamsList, string | LinkingConfig<any>>;
    path?: string;
    exact?: boolean;
    parse?: Record<string, (value: string) => any>;
    stringify?: Record<string, (value: any) => string>;
};

/**
 * Configure deep linking
 */
const linkingFrom = (days: RecordId[], tracks: RecordId[], rooms: RecordId[]): LinkingOptions<ScreenStartParamsList> => {
    // Dynamically create dynamic parts.
    const eventsLinking: LinkingConfig<EventsTabsScreenParamsList> = {
        initialRouteName: "Events",
        screens: {
            Favorites: "Areas/Events/Favorites",
            Results: "Areas/Events/Results",
            Search: "Areas/Events/Search",

            ...Object.fromEntries(days.map((id) => [id, `Areas/Events/Days/${id}`])),
            ...Object.fromEntries(tracks.map((id) => [id, `Areas/Events/Tracks/${id}`])),
            ...Object.fromEntries(rooms.map((id) => [id, `Areas/Events/Rooms/${id}`])),
        },
    };

    const dealersLinking: LinkingConfig<DealersTabsScreenParamsList> = {
        initialRouteName: "All",
        screens: {
            All: "Areas/Dealers",
            Mon: "Areas/Dealers/Mon",
            Tue: "Areas/Dealers/Tue",
            Wed: "Areas/Dealers/Wed",
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

    // TODO: Use configuration constants here.
    // Return the composed linking object.
    return {
        prefixes: [`https://app.eurofurence.org/${conId}/Web/`],
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
        },
    };
};

export const NavigationProvider: FC<PropsWithChildren> = ({ children }) => {
    const navigation = useRef<NavigationContainerRef<any> | null>(null);
    // Get navigation state from persistence.
    const [isReady, initialState, onStateChange] = useNavigationStatePersistence();
    const logEvent = useAnalytics();

    const theme = useTheme();
    const type = useThemeName();
    const navTheme = useMemo(
        () => ({
            dark: type === "dark",
            colors: {
                primary: theme.primary,
                background: theme.surface,
                card: theme.surface,
                text: theme.text,
                border: theme.darken,
                notification: theme.notification,
            },
        }),
        [type, theme],
    );

    const logAnalytics = useCallback(
        (state: NavigationState | undefined) => {
            // Skip, no state.
            if (!state) return null;

            // Get initial route and create path.
            let current = state.routes[state.index];
            let path = current.name;

            // While nested screens are available, add.
            while (typeof current?.state?.index === "number") {
                current = current.state.routes[current.state.index] as any;
                path = `${path}/${current.name}`;
            }

            // Log screen view with params.
            logEvent("screen_view", { screen_name: path, ...current.params }).catch(captureException);
        },
        [logEvent],
    );

    const days = useAppSelector(eventDaysSelectors.selectIds);
    const tracks = useAppSelector(eventTracksSelectors.selectIds);
    const rooms = useAppSelector(eventRoomsSelectors.selectIds);

    const linking = useMemo(() => linkingFrom(days, tracks, rooms), [days, tracks, rooms]);

    if (!isReady) {
        return null;
    }
    return (
        <NavigationContainer
            theme={navTheme}
            ref={navigation}
            linking={linking}
            initialState={initialState}
            onReady={() => {
                sentryRoutingInstrumentation?.registerNavigationContainer(navigation.current);
            }}
            onStateChange={(state) => {
                onStateChange(state);
                logAnalytics(state);
            }}
        >
            {children}
        </NavigationContainer>
    );
};
