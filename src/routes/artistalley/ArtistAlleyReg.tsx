import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../../components/AppStyles";
import { ArtistAlleyEdit } from "../../components/artistalley/ArtistAlleyEdit";
import { ArtistAlleyStatus } from "../../components/artistalley/ArtistAlleyStatus";
import { ArtistAlleyUnauthorized } from "../../components/artistalley/ArtistAlleyUnauthorized";
import { Badge } from "../../components/generic/containers/Badge";
import { Floater, padFloater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAuthContext } from "../../context/AuthContext";
import { useArtistAlleyOwnTableRegistrationQuery } from "../../store/eurofurence/service";

const stateToBackground = {
    Pending: "warning",
    Accepted: "primary",
    Published: "primary",
    Rejected: "notification",
} as const;

export type ArtistAlleyRegParams = object;

export const ArtistAlleyReg = () => {
    const { t } = useTranslation("ArtistAlley");
    const { t: tStatus } = useTranslation("ArtistAlley", { keyPrefix: "status" });

    // Get user data for RBAC checks and pre-filling.
    const { loggedIn, user, claims } = useAuthContext();

    // Get roles for preemptive RBAC.
    const attending = Boolean(user?.Roles?.includes("Attendee"));
    const checkedIn = Boolean(user?.Roles?.includes("AttendeeCheckedIn"));
    const authorized = loggedIn && attending && checkedIn;

    // Get current registration if available. Only run when authorized.
    const { data, isFetching, refetch } = useArtistAlleyOwnTableRegistrationQuery(undefined, {
        skip: !authorized,
    });

    // Switch for show and edit modes.
    const [show, setShow] = useState(true);

    return (
        <ScrollView style={StyleSheet.absoluteFill} refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />} stickyHeaderIndices={[0]}>
            <Header>{t("title")}</Header>
            <Floater containerStyle={appStyles.trailer}>
                {!data?.State ? null : (
                    <Badge unpad={padFloater} badgeColor={stateToBackground[data.State as keyof typeof stateToBackground]} textColor="white">
                        {tStatus(data.State)}
                    </Badge>
                )}
                {authorized ? (
                    !isFetching ? (
                        show && data ? (
                            <ArtistAlleyStatus data={data} onEdit={() => setShow(false)} />
                        ) : (
                            <ArtistAlleyEdit
                                prefill={{
                                    displayName: data?.DisplayName ?? (claims?.name as string) ?? "",
                                    websiteUrl: data?.WebsiteUrl ?? "",
                                    shortDescription: data?.ShortDescription ?? "",
                                    telegramHandle: data?.TelegramHandle ?? "",
                                    imageUri: data?.Image?.Url ?? "",
                                    location: "",
                                }}
                                onDismiss={() => setShow(true)}
                                mode={data ? "change" : "new"}
                            />
                        )
                    ) : null
                ) : (
                    <ArtistAlleyUnauthorized loggedIn={loggedIn} attending={attending} checkedIn={checkedIn} />
                )}
            </Floater>
        </ScrollView>
    );
};
