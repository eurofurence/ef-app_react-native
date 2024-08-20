import { LinkingOptions, NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { NavigationState } from "@react-navigation/routers";
import { captureException, ReactNavigationInstrumentation } from "@sentry/react-native";
import * as SplashScreen from "expo-splash-screen";
import { FC, PropsWithChildren, useCallback, useMemo, useRef } from "react";

import { conId } from "../configuration";
import { useAnalytics } from "../hooks/analytics/useAnalytics";
import { useNavigationStatePersistence } from "../hooks/nav/useNavigationStatePersistence";
import { useTheme, useThemeName } from "../hooks/themes/useThemeHooks";
import { AreasRouterParamsList } from "../routes/AreasRouter";
import { IndexRouterParamsList } from "../routes/IndexRouter";
import { DealersRouterParamsList } from "../routes/dealers/DealersRouter";
import { EventsRouterParamsList } from "../routes/events/EventsRouter";
import { useAppSelector } from "../store";
import { eventDaysSelectors, eventRoomsSelectors, eventTracksSelectors } from "../store/eurofurence/selectors/records";
import { RecordId } from "../store/eurofurence/types";

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
const linkingFrom = (days: RecordId[], tracks: RecordId[], rooms: RecordId[]): LinkingOptions<IndexRouterParamsList> => {
    // Dynamically create dynamic parts.
    const eventsLinking: LinkingConfig<EventsRouterParamsList> = {
        initialRouteName: "Events",
        path: "events",
        screens: {
            Search: "search",
            Personal: "personal",

            ...Object.fromEntries(days.map((id) => [id, `days/${id}`])),
            ...Object.fromEntries(tracks.map((id) => [id, `tracks/${id}`])),
            ...Object.fromEntries(rooms.map((id) => [id, `rooms/${id}`])),
        },
    };

    const dealersLinking: LinkingConfig<DealersRouterParamsList> = {
        initialRouteName: "All",
        screens: {
            All: "dealers",
            Personal: "dealers/personal",
            Regular: "dealers/regular",
            AD: "dealers/ad",
            Alpha: "dealers/az",
        },
    };

    const areasLinking: LinkingConfig<AreasRouterParamsList> = {
        initialRouteName: "Home",
        screens: {
            Home: "/",
            Events: eventsLinking,
            Dealers: dealersLinking,
        },
    };

    // TODO: Check if issue with linking, prefix.

    // TODO: Use configuration constants here.
    // Return the composed linking object.
    return {
        prefixes: [`https://app.eurofurence.org/${conId}/Web/`],
        config: {
            initialRouteName: "Areas",
            screens: {
                Areas: areasLinking,
                Announcement: "announcement/:id",
                Event: "events/:id",
                Dealer: "dealers/:id",
                Settings: "settings",
                RevealHidden: "settings/reveal-hidden",
                PrivateMessageList: "pm",
                KnowledgeGroups: "kb",
                KnowledgeEntry: "kb/:id",
                Map: "map/:id",
                About: "about",
                Profile: "profile",
                Viewer: "viewer/:id",
                EventFeedback: "events/:id/feedback",
            },
        },
    };
};

export const NavigationProvider: FC<PropsWithChildren> = ({ children }) => {
    const navigation = useRef<NavigationContainerRef<any> | null>(null);
    // Get navigation state from persistence.
    const [navStateReady, navStateInitial, onNavStateChange] = useNavigationStatePersistence();
    const logEvent = useAnalytics();

    const theme = useTheme();
    const type = useThemeName();
    const navTheme = useMemo(
        () => ({
            dark: type === "dark",
            colors: {
                primary: theme.secondary,
                background: theme.surface,
                card: theme.background,
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
    const cacheReady = useAppSelector((state) => state.eurofurenceCache.state !== "uninitialized");
    const days = useAppSelector(eventDaysSelectors.selectIds);
    const tracks = useAppSelector(eventTracksSelectors.selectIds);
    const rooms = useAppSelector(eventRoomsSelectors.selectIds);

    const linking = useMemo(() => linkingFrom(days, tracks, rooms), [days, tracks, rooms]);

    if (!navStateReady || !cacheReady) {
        return null;
    }

    return (
        <NavigationContainer
            theme={navTheme}
            ref={navigation}
            linking={linking}
            initialState={navStateInitial}
            fallback={null}
            onReady={() => {
                SplashScreen.hideAsync().catch();
                sentryRoutingInstrumentation?.registerNavigationContainer(navigation.current);
            }}
            onStateChange={(state) => {
                onNavStateChange(state);
                logAnalytics(state);
            }}
        >
            {children}
        </NavigationContainer>
    );
};
