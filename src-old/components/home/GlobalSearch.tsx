import { Moment } from "moment/moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { useDealerInstances } from "../../routes/dealers/Dealers.common";
import { useEventInstances } from "../../routes/events/Events.common";
import { HomeProps } from "../../routes/home/Home";
import { DealerDetails, EventDetails, KnowledgeEntryDetails } from "../../store/eurofurence/types";
import { DealerCard } from "../dealers/DealerCard";
import { EventCard } from "../events/EventCard";
import { Section } from "../generic/atoms/Section";
import { KbEntryCard } from "../kb/KbEntryCard";
import { useZoneAbbr } from "../../hooks/time/useZoneAbbr";
import { WithType } from "../../store/eurofurence/selectors/search";

export type GlobalSearchProps = {
    navigation: HomeProps["navigation"];
    now: Moment;
    results: (WithType<DealerDetails, "dealer"> | WithType<EventDetails, "event"> | WithType<KnowledgeEntryDetails, "knowledgeEntry">)[] | null;
};

export const GlobalSearch = ({ navigation, now, results }: GlobalSearchProps) => {
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
            {!dealers?.length ? null : (
                <>
                    <Section icon="card-search" title={tMenu("dealers")} />
                    {dealers.map((item) => (
                        <DealerCard key={item.details.Id} containerStyle={styles.item} dealer={item} onPress={(dealer) => navigation.navigate("Dealer", { id: dealer.Id })} />
                    ))}
                </>
            )}
            {!events?.length ? null : (
                <>
                    <Section icon="card-search" title={tMenu("events")} />
                    {events.map((item) => (
                        <EventCard
                            key={item.details.Id}
                            containerStyle={styles.item}
                            event={item}
                            type="time"
                            onPress={(event) =>
                                navigation.navigate("Event", {
                                    id: event.Id,
                                })
                            }
                        />
                    ))}
                </>
            )}
            {!kbGroups?.length ? null : (
                <>
                    <Section icon="card-search" title={tMenu("info")} />
                    {kbGroups.map((item) => (
                        <KbEntryCard containerStyle={styles.item} entry={item} key={item.Id} onPress={(entry) => navigation.navigate("KnowledgeEntry", { id: entry.Id })} />
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
