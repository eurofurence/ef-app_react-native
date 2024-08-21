import { captureException } from "@sentry/react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../components/AppStyles";
import { ProfileContent } from "../components/ProfileContent";
import { Continuous } from "../components/generic/atoms/Continuous";
import { Floater, padFloater } from "../components/generic/containers/Floater";
import { Header } from "../components/generic/containers/Header";
import { useAuthContext } from "../context/AuthContext";
import { useAppNavigation } from "../hooks/nav/useAppNavigation";

export const Profile = () => {
    const navigation = useAppNavigation("Profile");

    const { t } = useTranslation("Profile");
    const { refresh, loggedIn, claims, user } = useAuthContext();
    const [isReloading, setIsReloading] = useState(false);
    const doReload = useCallback(() => {
        setIsReloading(true);
        refresh()
            .catch(captureException)
            .finally(() => {
                setIsReloading(false);
            });
    }, [refresh]);

    // Pop if not logged in or unable to retrieve proper user data.
    useEffect(() => {
        if (!loggedIn) {
            navigation.pop();
        }
    }, [loggedIn, navigation]);

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header secondaryIcon="refresh" secondaryPress={() => doReload()}>
                {t("header")}
            </Header>
            <Continuous active={isReloading} />
            <Floater contentStyle={appStyles.trailer}>{!claims || !user ? null : <ProfileContent claims={claims} user={user} parentPad={padFloater} />}</Floater>
        </ScrollView>
    );
};
