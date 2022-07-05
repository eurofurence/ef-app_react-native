import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { Label } from "../components/Atoms/Label";
import { AuthorizationOverview } from "../components/Authorization/AuthorizationOverview";
import { LoginForm } from "../components/Authorization/LoginForm";
import { Button } from "../components/Containers/Button";
import { Navigator } from "../components/Containers/Navigator/Navigator";
import { Pager } from "../components/Containers/Pager";
import { LoadingIndicator } from "../components/Utilities/LoadingIndicator";
import { useTheme } from "../context/Theme";
import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/authorization.slice";
import { useGetAnnouncementsQuery, useGetDealersQuery, useGetEventByIdQuery, useGetEventsQuery } from "../store/eurofurence.service";
import { AnnouncementRecord, EnrichedDealerRecord, EventRecord } from "../store/eurofurence.types";

export const StartScreen = () => {
    const dispatch = useAppDispatch();
    const [read, setRead] = useState(false);
    const loggedIn = useAppSelector((state) => state.authorization.isLoggedIn);

    const nav = useRef<any>();
    const pager = useRef<any>();
    const on = useMemo(
        () => ({
            home: () => nav.current?.close(),
            events: () => nav.current?.close(),
            dealers: () => nav.current?.close(),
            login: () => pager.current?.toRight(),
            loginBack: () => pager.current?.toLeft(),
            messages: () => nav.current?.close(),
            info: () => nav.current?.close(),
            catchEmAll: () => nav.current?.close(),
            services: () => nav.current?.close(),
            settings: () => nav.current?.close(),
            about: () => nav.current?.close(),
        }),
        [nav]
    );
    const { t } = useTranslation();
    const announcements: Query<AnnouncementRecord[]> = useGetAnnouncementsQuery();

    const wide = useWindowDimensions().width >= 1000;

    const events: Query<EventRecord[]> = useGetEventsQuery();
    const event: Query<EventRecord, string> = useGetEventByIdQuery("76430fe0-ece7-48c9-b8e6-fdbc3974ff64");
    const dealers: Query<EnrichedDealerRecord[]> = useGetDealersQuery();

    const theme = useTheme();

    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={{ padding: 30 }}>
                <AuthorizationOverview />
                <Text style={{ marginTop: 30, fontSize: 20, padding: 5 }}> {t("hello")}</Text>

                {/* Theme verifier. */}
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
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

                {/* Label style verifier. */}
                <View style={{ backgroundColor: theme.primary, alignSelf: "stretch", padding: 30 }}>
                    <Label type="h1" color="invText">
                        Heading 1
                    </Label>
                    <Label type="h2" color="invText">
                        Heading 2
                    </Label>
                    <Label type="h3" color="invText">
                        Heading 3
                    </Label>
                    <Label type="h4" color="invText">
                        Heading 4
                    </Label>
                    <Label type="span" color="invText">
                        Span
                    </Label>
                    <Label type="span" color="invImportant">
                        Important span
                    </Label>
                </View>

                {announcements.isFetching ? <LoadingIndicator /> : <Text>There are {announcements.data?.length} announcements</Text>}
                {events.isFetching ? <LoadingIndicator /> : <Text>There are {events.data?.length} events</Text>}
                {event.isFetching ? <LoadingIndicator /> : <Text>We have retrieved event {event.data.Title}</Text>}
                {dealers.isFetching ? <LoadingIndicator /> : <Text>We have {dealers.data.length} dealers</Text>}
                <Button containerStyle={styles.marginAfter} onPress={() => setRead(false)}>
                    Reset read
                </Button>
                <Button containerStyle={styles.marginAfter} onPress={() => dispatch(logout())}>
                    Log-out
                </Button>
            </View>
            <Navigator
                ref={nav}
                onOpen={() => setRead(true)}
                onClose={() => pager.current?.toLeft()}
                indicateMore={!read}
                // indicateMore={<Indi>12</Indi>}
                tabs={[
                    { icon: "home", text: "Home", onPress: on.home, active: true },
                    { icon: "calendar", text: "Events", onPress: on.events },
                    { icon: "cart-outline", text: "Dealers", onPress: on.dealers },
                    wide && { icon: "information-circle", onPress: on.info, text: "Info articles" },
                    wide && { icon: "paw", onPress: on.catchEmAll, text: "Catch-em-all" },
                    wide && { icon: "book-outline", onPress: on.services, text: "Services" },
                ].filter(Boolean)}
            >
                <Pager
                    ref={pager}
                    left={
                        <View style={{ padding: 30 }}>
                            {loggedIn ? (
                                <>
                                    <Text style={styles.marginAfter}>
                                        You have <Text style={{ fontWeight: "bold" }}>12</Text> new messages
                                    </Text>
                                    <Button containerStyle={styles.marginAfter} icon="mail-outline" onPress={on.messages}>
                                        Open messages
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.marginAfter}>You are currently not logged in</Text>
                                    <Button containerStyle={styles.marginAfter} icon="log-in" onPress={on.login}>
                                        Log-in now
                                    </Button>
                                </>
                            )}

                            <Text style={styles.marginAfter}>More locations</Text>
                            {wide ? null : (
                                <Button containerStyle={styles.marginAfter} icon="information-circle" onPress={on.info}>
                                    Info articles
                                </Button>
                            )}
                            {wide ? null : (
                                <Button containerStyle={styles.marginAfter} icon="paw" onPress={on.catchEmAll}>
                                    Catch-em-all
                                </Button>
                            )}
                            {wide ? null : (
                                <Button containerStyle={styles.marginAfter} icon="book-outline" onPress={on.services}>
                                    Services
                                </Button>
                            )}

                            <View style={[styles.marginBefore, styles.row]}>
                                <Button containerStyle={styles.rowLeft} outline icon="cog" onPress={on.settings}>
                                    Settings
                                </Button>
                                <Button containerStyle={styles.rowRight} outline icon="card-outline" onPress={on.about}>
                                    About
                                </Button>
                            </View>
                        </View>
                    }
                    right={<LoginForm close={on.loginBack} />}
                />
            </Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    marginAfter: {
        marginBottom: 16,
    },
    input: {
        borderBottomColor: "black",
        borderBottomWidth: 1,
        paddingVertical: 8,
    },
    marginBefore: {
        marginTop: 16,
    },
    row: {
        flexDirection: "row",
    },
    rowLeft: {
        flex: 1,
        marginRight: 8,
    },
    rowRight: {
        flex: 1,
        marginLeft: 8,
    },
});
