import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { router } from "expo-router";
import { DealerCard } from "../dealers/DealerCard";
import { EventCard } from "../events/EventCard";
import { Section } from "../generic/atoms/Section";
import { KbEntryCard } from "../kb/KbEntryCard";
import { useDealerInstances } from "@/components/dealers/Dealers.common";
import { useEventInstances } from "@/components/events/Events.common";
import { DealerDetails, EventDetails, KnowledgeEntryDetails } from "@/store/eurofurence/types";
import { useZoneAbbr } from "@/hooks/time/useZoneAbbr";
import { GlobalSearchResult } from "@/store/eurofurence/selectors/search";

export type GlobalSearchProps = {
    now: Date;
    results: GlobalSearchResult[] | null;
};

export const GlobalSearch = ({ now, results }: GlobalSearchProps) => {
    const { t: tMenu } = useTranslation("Menu");
    const { t: tDealers } = useTranslation("Dealers");
    const { t: tEvents } = useTranslation("Events");

    // Zone abbreviation for events.
    const zone = useZoneAbbr();

    // Use all dealers and group generically.
    const dealers = useDealerInstances(tDealers, now, results?.filter((r) => r.type === "dealer") as DealerDetails[]);
    const events = useEventInstances(tEvents, now, zone, results?.filter((r) => r.type === "event") as EventDetails[]);
    const kbGroups = results?.filter((r) => r.type === "knowledgeEntry") as KnowledgeEntryDetails[];

    if (!results) return null;
    return (
        <>
            {dealers && dealers.length > 0 && (
                <>
                    <Section icon="card-search" title={tMenu("dealers")} />
                    {dealers.map((item) => (
                        <DealerCard
                            key={item.details.Id}
                            containerStyle={styles.item}
                            dealer={item}
                            onPress={(dealer) =>
                                router.navigate({
                                    pathname: "/dealers/[dealerId]",
                                    params: { dealerId: dealer.Id },
                                })
                            }
                        />
                    ))}
                </>
            )}
            {events && events.length > 0 && (
                <>
                    <Section icon="card-search" title={tMenu("events")} />
                    {events.map((item) => (
                        <EventCard
                            key={item.details.Id}
                            containerStyle={styles.item}
                            event={item}
                            type="time"
                            onPress={(event) =>
                                router.navigate({
                                    pathname: "/events/[eventId]",
                                    params: { eventId: event.Id },
                                })
                            }
                        />
                    ))}
                </>
            )}
            {kbGroups && kbGroups.length > 0 && (
                <>
                    <Section icon="card-search" title={tMenu("info")} />
                    {kbGroups.map((item) => (
                        <KbEntryCard
                            containerStyle={styles.item}
                            entry={item}
                            key={item.Id}
                            onPress={(entry) =>
                                router.navigate({
                                    pathname: "/knowledge/[knowledgeId]",
                                    params: { knowledgeId: entry.Id },
                                })
                            }
                        />
                    ))}
                </>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 20,
    },
});
