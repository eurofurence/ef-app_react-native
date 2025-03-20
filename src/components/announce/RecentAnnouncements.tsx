import { orderBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { addMinutes, isAfter, isBefore, parseISO, subMinutes, formatDistanceToNow } from "date-fns";
import { router } from "expo-router";
import { Section } from "../generic/atoms/Section";
import { Button } from "../generic/containers/Button";
import { AnnouncementCard } from "./AnnouncementCard";
import { useDataCache } from "@/context/DataCacheProvider";
import { AnnouncementRecord, AnnouncementDetails } from "@/store/eurofurence/types";

const recentLimit = 2;

export const RecentAnnouncements = ({ now }: { now: Date }) => {
    const { t } = useTranslation("Home");
    const { getAllCache } = useDataCache();
    const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const cachedAnnouncements = await getAllCache<AnnouncementRecord>("announcements");
                if (cachedAnnouncements) {
                    const filtered = cachedAnnouncements
                        .map((item) => item.data)
                        .filter((it) => {
                            const validFrom = parseISO(it.ValidFromDateTimeUtc);
                            const validUntil = parseISO(it.ValidUntilDateTimeUtc);

                            return isAfter(now, subMinutes(validFrom, 5)) && isBefore(now, addMinutes(validUntil, 5));
                        });

                    setAnnouncements(filtered);
                }
            } catch (error) {
                console.error("Failed to fetch announcements:", error);
            }
        };

        fetchAnnouncements().then();
    }, [getAllCache]);

    /**
     * Creates the announcement instance props for an upcoming or running announcement.
     * @param details The details to use.
     */
    const announcementInstanceForAny = (details: AnnouncementRecord): AnnouncementDetailsInstance => {
        const validFromDate = parseISO(details.ValidFromDateTimeUtc);
        const time = formatDistanceToNow(validFromDate, { addSuffix: true });

        // Convert AnnouncementRecord to AnnouncementDetails
        const announcementDetails: AnnouncementDetails = {
            ...details,
            NormalizedTitle: details.Title, // Assuming NormalizedTitle is similar to Title
        };

        return { details: announcementDetails, time };
    };

    const recentAnnouncements = useMemo(
        () => orderBy(announcements, "ValidFromDateTimeUtc", "desc").slice(0, recentLimit).map(announcementInstanceForAny), // Now it works without errors
        [announcements],
    );

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
                                params: { announcementId: announcement.Id },
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
        marginVertical: -15,
    },
    button: {
        marginTop: 20,
    },
});

// Define AnnouncementDetailsInstance type inside the file
type AnnouncementDetailsInstance = {
    details: AnnouncementDetails;
    time: string;
};
