import { orderBy } from "lodash";
import type { Moment } from "moment-timezone";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { selectActiveAnnouncements } from "../../store/eurofurence/selectors/announcements";
import { Section } from "../generic/atoms/Section";
import { Button } from "../generic/containers/Button";
import { AnnouncementCard, announcementInstanceForAny } from "./AnnouncementCard";

const recentLimit = 2;

export type RecentAnnouncementsProps = {
    now: Moment;
};

/**
 * Shows the two latest announcements and a button to open all of them,
 * @param now The current time.
 * @constructor
 */
export const RecentAnnouncements = ({ now }: RecentAnnouncementsProps) => {
    const navigation = useAppNavigation("Areas");
    const { t } = useTranslation("Home");

    // Get all active announcements.
    const announcements = useAppSelector((state) => selectActiveAnnouncements(state, now));

    // Select to the recent announcements.
    const recentAnnouncements = useMemo(
        () =>
            orderBy(announcements, "ValidFromDateTimeUtc", "desc")
                .slice(0, recentLimit)
                .map((details) => announcementInstanceForAny(details, now)),
        [announcements, now],
    );

    // Skip if empty.
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
                            navigation.navigate("AnnounceItem", {
                                id: announcement.Id,
                            })
                        }
                    />
                ))}
            </View>
            <Button style={styles.button} onPress={() => navigation.navigate("AnnounceList")} outline>
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
