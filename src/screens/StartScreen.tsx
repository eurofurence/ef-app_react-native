import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

import { AuthorizationOverview } from "../components/Authorization/AuthorizationOverview";
import { LoginForm } from "../components/Authorization/LoginForm";
import { Button } from "../components/Containers/Button";
import { Navigator } from "../components/Containers/Navigator";
import { Pager } from "../components/Containers/Pager";
import { LoadingIndicator } from "../components/Utilities/LoadingIndicator";
import { useAppDispatch, useAppSelector } from "../store";
import { selectById } from "../store/authorization.service";
import { logout } from "../store/authorization.slice";
import { useGetAnnouncementsQuery, useGetDealersQuery, useGetEventByIdQuery, useGetEventsQuery } from "../store/eurofurence.service";
import { AnnouncementRecord, EnrichedDealerRecord, EventRecord } from "../store/eurofurence.types";

const Indi = ({ children }) => <Text style={{ fontSize: 9, color: "white" }}>{12}</Text>;

export const StartScreen = () => {
    const dispatch = useAppDispatch();
    const [read, setRead] = useState(false);
    const loggedIn = useAppSelector((state) => state.authorization.isLoggedIn);

    const nav = useRef();
    const pager = useRef();
    const on = useMemo(
        () => ({
            home: () => nav.current?.close(),
            events: () => nav.current?.close(),
            dealers: () => nav.current?.close(),
            login: () => pager.current?.toRight(),
            loginActual: () => {
                setLoggedIn(true);
                pager.current?.toLeft();
            },
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

    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={{ padding: 30 }}>
                <AuthorizationOverview />
                <Text style={{ fontSize: 20, padding: 5 }}> {t("hello")}</Text>
                {announcements.isFetching ? <LoadingIndicator /> : <Text>There are {announcements.data?.length} announcements</Text>}
                {events.isFetching ? <LoadingIndicator /> : <Text>There are {events.data?.length} events</Text>}
                {event.isFetching ? <LoadingIndicator /> : <Text>We have retrieved event {event.data?.Title}</Text>}
                {dealers.isFetching ? <LoadingIndicator /> : <Text>We have {dealers.data?.length} dealers</Text>}
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
