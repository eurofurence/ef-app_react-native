import { useNavigationState } from "@react-navigation/core";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Toast } from "../components/Toast";
import { useToastMessages } from "../context/ToastContext";
import { useTheme, useThemeMemo, useThemeName } from "../hooks/themes/useThemeHooks";
import { RecordId } from "../store/eurofurence/types";
import { About } from "./About";
import { AreasRouter, AreasRouterParams } from "./AreasRouter";
import { Profile } from "./Profile";
import { Viewer, ViewerParams } from "./Viewer";
import { AnnounceItem, AnnounceItemParams } from "./announce/AnnounceItem";
import { AnnounceList, AnnounceListParams } from "./announce/AnnounceList";
import { ArtistAlleyReg, ArtistAlleyRegParams } from "./artistalley/ArtistAlleyReg";
import { DealerItem, DealerItemParams } from "./dealers/DealerItem";
import { EventFeedback } from "./events/EventFeedback";
import { EventItem, EventItemParams } from "./events/EventItem";
import { KbItem } from "./kb/KbItem";
import { KbList } from "./kb/KbList";
import { Map } from "./maps/Map";
import { PmItem, PmItemParams } from "./pm/PmItem";
import { PmList } from "./pm/PmList";
import { RevealHidden } from "./settings/RevealHidden";
import { Settings } from "./settings/Settings";

/**
 * Available routes.
 */
export type IndexRouterParamsList = {
    /**
     * Primary areas.
     */
    Areas: AreasRouterParams;
    ArtistAlleyReg: ArtistAlleyRegParams;
    AnnounceList: AnnounceListParams;
    AnnounceItem: AnnounceItemParams;
    Event: EventItemParams;
    Dealer: DealerItemParams;
    EventFeedback: { id: string };
    Settings: undefined;
    RevealHidden: undefined;
    PrivateMessageList: undefined;
    PrivateMessageItem: PmItemParams;
    KnowledgeGroups: object;
    KnowledgeEntry: {
        id: RecordId;
    };
    Map: {
        id: RecordId;
        entryId?: RecordId;
        linkId?: number;
    };
    About: undefined;
    Profile: undefined;
    Viewer: ViewerParams;
};

const Stack = createStackNavigator<IndexRouterParamsList>();

/**
 * The properties to the screen as a component. This does not have navigator properties, as it
 * is the node initially providing the navigation container.
 */
export type IndexRouterProps = object;

/**
 * This is the main router that starts on the primary screens (events, dealers, home) and allows pushing
 * child elements on the stack.
 */
export const IndexRouter: FC<IndexRouterProps> = () => {
    // Get the theme type for status bar configuration.
    const theme = useTheme();
    const themeType = useThemeName();

    // Get toasts to render. Do not render if in areas, there, the tab control renders the toasts.
    const toastMessages = useToastMessages(5);
    const isAreas = useNavigationState((s) => (!s ? false : s.routes?.[s.index]?.name === "Areas"));

    const safeAreaStyle = useThemeMemo((theme) => ({ ...StyleSheet.absoluteFillObject, backgroundColor: theme.background }));

    return (
        <SafeAreaView style={safeAreaStyle}>
            <StatusBar backgroundColor={theme.background} style={themeType === "light" ? "dark" : "light"} />
            <Stack.Navigator screenOptions={{ headerShown: false, detachPreviousScreen: false }}>
                <Stack.Screen name="Areas" component={AreasRouter} />
                <Stack.Screen name="ArtistAlleyReg" component={ArtistAlleyReg} />
                <Stack.Screen name="AnnounceList" component={AnnounceList} />
                <Stack.Screen name="AnnounceItem" component={AnnounceItem} />
                <Stack.Screen name="Event" component={EventItem} />
                <Stack.Screen name="Dealer" component={DealerItem} />
                <Stack.Screen name="EventFeedback" component={EventFeedback} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="RevealHidden" component={RevealHidden} />
                <Stack.Screen name="PrivateMessageList" component={PmList} />
                <Stack.Screen name="PrivateMessageItem" component={PmItem} />
                <Stack.Screen name="KnowledgeGroups" component={KbList} />
                <Stack.Screen name="KnowledgeEntry" component={KbItem} />
                <Stack.Screen name="Map" component={Map} />
                <Stack.Screen name="About" component={About} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Viewer" component={Viewer} />
            </Stack.Navigator>

            {/* Render toasts when not in an "Areas" screen and a message is present. */}
            {isAreas || !toastMessages.length ? null : (
                <View style={styles.toastContainer}>
                    {[...toastMessages].reverse().map((toast) => (
                        <Toast key={toast.id} {...toast} loose={true} />
                    ))}
                </View>
            )}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    toastContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 30,
    },
});
