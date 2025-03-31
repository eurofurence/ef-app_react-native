import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { addMinutes, isAfter, isBefore, parseISO, subMinutes, formatDistanceToNow } from "date-fns";
import { router } from "expo-router";
import { chain } from "lodash";
import { Section } from "../generic/atoms/Section";
import { Button } from "../generic/containers/Button";
import { AnnouncementCard } from "./AnnouncementCard";
import { useDataCache } from "@/context/DataCacheProvider";
import { AnnouncementDetails } from "@/store/eurofurence/types";

const recentLimit = 2;

export const RecentAnnouncements = ({ now }: { now: Date }) => {
    const { t } = useTranslation("Home");
    const { getAllCacheSync } = useDataCache();

    const announcements = useMemo(() =>
        chain(getAllCacheSync("announcements") || [])
            .map(item => item.data)
            .filter(item => {
                const validFrom = parseISO(item.ValidFromDateTimeUtc);
                const validUntil = parseISO(item.ValidUntilDateTimeUtc);

                return isAfter(now, subMinutes(validFrom, 5)) && isBefore(now, addMinutes(validUntil, 5));
            })
            .sortBy("ValidFromDateTimeUtc", "desc")
            .value(), [getAllCacheSync, now]);

    /**
     * Creates the announcement instance props for an upcoming or running announcement.
     * @param details The details to use.
     */
    const announcementInstanceForAny = (details: AnnouncementDetails): AnnouncementDetailsInstance => {
        const validFromDate = parseISO(details.ValidFromDateTimeUtc);
        const time = formatDistanceToNow(validFromDate, { addSuffix: true });
        return { details, time };
    };

    const recentAnnouncements = useMemo(() => announcements.slice(0, recentLimit).map(announcementInstanceForAny), [announcements]);

    if (recentAnnouncements.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("recent_announcements")} subtitle={t("announcementsTitle", { count: announcements.length })} icon="newspaper" />
            <View style={styles.condense}>
                {recentAnnouncements.map((item) => (
                    <AnnouncementCard
                        key={item.details.Id}
                        announcement={item}
                        onPress={(announcement) =>
                            router.navigate({
                                pathname: "/announcements/[announcementId]",
                                params: { announcementId: announcement.Id }
                            })
                        }
                    />
                ))}
            </View>
            <Button style={styles.button} onPress={() => router.navigate("AnnounceList")} outline>
                {t("view_all_announcements")}
            </Button>
        </>
    );
};

const styles = StyleSheet.create({
    condense: {
        marginVertical: -15
    },
    button: {
        marginTop: 20
    }
});

// Define AnnouncementDetailsInstance type inside the file
type AnnouncementDetailsInstance = {
    details: AnnouncementDetails;
    time: string;
};
