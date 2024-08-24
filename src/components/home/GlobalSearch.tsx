import { Moment } from "moment/moment";
import React from "react";
import { useTranslation } from "react-i18next";

import { useDealerGroups } from "../../routes/dealers/Dealers.common";
import { useEventSearchGroups } from "../../routes/events/Events.common";
import { HomeProps } from "../../routes/home/Home";
import { DealerDetails, EventDetails, KnowledgeEntryDetails } from "../../store/eurofurence/types";
import { DealersSectionedList } from "../dealers/DealersSectionedList";
import { EventsSectionedList } from "../events/EventsSectionedList";
import { Section } from "../generic/atoms/Section";
import { KbSectionedList } from "../kb/KbSectionedList";

export type GlobalSearchProps = {
    navigation: HomeProps["navigation"];
    now: Moment;
    results: (DealerDetails | EventDetails | KnowledgeEntryDetails)[] | null;
};

export const GlobalSearch = ({ navigation, now, results }: GlobalSearchProps) => {
    const { t: tMenu } = useTranslation("Menu");
    const { t: tDealers } = useTranslation("Dealers");
    const { t: tEvents } = useTranslation("Events");

    // Use all dealers and group generically.
    const dealersGroups = useDealerGroups(tDealers, now, results?.filter((r) => "RegistrationNumber" in r) as DealerDetails[], []);
    const eventGroups = useEventSearchGroups(tEvents, now, results?.filter((r) => "StartDateTimeUtc" in r) as EventDetails[]);
    const kbGroups = results?.filter((r) => "KnowledgeGroupId" in r) as KnowledgeEntryDetails[];

    if (!results) return null;
    return (
        <>
            {!dealersGroups?.length ? null : (
                <DealersSectionedList
                    navigation={navigation as any}
                    dealersGroups={dealersGroups}
                    leader={<Section icon="card-search" title={tMenu("dealers")} />}
                    padEnd={false}
                />
            )}
            {!eventGroups?.length ? null : (
                <EventsSectionedList
                    navigation={navigation as any}
                    eventsGroups={eventGroups}
                    cardType="time"
                    leader={<Section icon="card-search" title={tMenu("events")} />}
                    padEnd={false}
                />
            )}
            {!kbGroups?.length ? null : (
                <KbSectionedList navigation={navigation as any} kbGroups={kbGroups} leader={<Section icon="card-search" title={tMenu("info")} />} padEnd={false} />
            )}
        </>
    );
};
