import React, { useEffect, useMemo, useState } from "react";
import Fuse, { FuseOptionKey, IFuseOptions } from "fuse.js";
import { flatten } from "lodash";
import { useDataCache } from "@/context/DataCacheProvider";
import { AnnouncementDetails, DealerDetails, EventDetails, KnowledgeEntryDetails } from "../types";

// Global type for search results
export type GlobalSearchResult = (DealerDetails & { type: "dealer" }) | (EventDetails & { type: "event" }) | (KnowledgeEntryDetails & { type: "knowledgeEntry" });

// ----- Search Options -----
const searchOptions: IFuseOptions<any> = {
    shouldSort: true,
    threshold: 0.25,
    ignoreLocation: true,
};

// ----- Dealer Search Properties -----
const dealerSearchProperties: FuseOptionKey<DealerDetails>[] = [
    {
        name: "DisplayNameOrAttendeeNickname",
        weight: 2,
    },
    {
        name: "Categories",
        weight: 1,
    },
    {
        name: "Keywords",
        getFn: (details) => (details.Keywords ? flatten(Object.values(details.Keywords)) : []),
        weight: 1,
    },
    {
        name: "ShortDescription",
        weight: 1,
    },
    {
        name: "AboutTheArtistText",
        weight: 1,
    },
    {
        name: "AboutTheArtText",
        weight: 1,
    },
];

// ----- Event Search Properties -----
const eventSearchProperties: FuseOptionKey<EventDetails>[] = [
    { name: "Title", weight: 2 },
    { name: "SubTitle", weight: 1 },
    { name: "Abstract", weight: 0.5 },
    { name: "ConferenceRoom.Name", weight: 0.333 },
    { name: "ConferenceTrack.Name", weight: 0.333 },
    { name: "Abstract", weight: 0.5 },
    { name: "PanelHosts", weight: 0.1 },
];

// ----- Knowledge Entry Search Properties -----
const kbSearchProperties: FuseOptionKey<KnowledgeEntryDetails>[] = [
    { name: "Title", weight: 1.5 },
    { name: "Text", weight: 1 },
];

// ----- Announcement Search Properties -----
const announceSearchProperties: FuseOptionKey<AnnouncementDetails>[] = [
    { name: "NormalizedTitle", weight: 1.5 },
    { name: "Content", weight: 1 },
    { name: "Author", weight: 0.5 },
    { name: "Area", weight: 0.5 },
];

// ----- Hooks to create Fuse Search Indexes using DataCacheProvider -----

export const useDealersSearchIndex = () => {
    const { getAllCache } = useDataCache();
    const [dealers, setDealers] = useState<DealerDetails[]>([]);

    useEffect(() => {
        (async () => {
            const cached = await getAllCache<DealerDetails>("dealers");
            setDealers(cached.map((item) => item.data));
        })();
    }, [getAllCache]);

    return useMemo(() => new Fuse(dealers, searchOptions, Fuse.createIndex(dealerSearchProperties, dealers)), [dealers]);
};

export const useEventsSearchIndex = () => {
    const { getAllCache } = useDataCache();
    const [events, setEvents] = useState<EventDetails[]>([]);

    useEffect(() => {
        (async () => {
            const cached = await getAllCache<EventDetails>("events");
            setEvents(cached.map((item) => item.data));
        })();
    }, [getAllCache]);

    return useMemo(() => new Fuse(events, searchOptions, Fuse.createIndex(eventSearchProperties, events)), [events]);
};

export const useKbSearchIndex = () => {
    const { getAllCache } = useDataCache();
    const [entries, setEntries] = useState<KnowledgeEntryDetails[]>([]);

    useEffect(() => {
        (async () => {
            const cached = await getAllCache<KnowledgeEntryDetails>("knowledgeEntries");
            setEntries(cached.map((item) => item.data));
        })();
    }, [getAllCache]);

    return useMemo(() => new Fuse(entries, searchOptions, Fuse.createIndex(kbSearchProperties, entries)), [entries]);
};

export const useAnnounceSearchIndex = () => {
    const { getAllCache } = useDataCache();
    const [announcements, setAnnouncements] = useState<AnnouncementDetails[]>([]);

    useEffect(() => {
        (async () => {
            const cached = await getAllCache<AnnouncementDetails>("announcements");
            setAnnouncements(cached.map((item) => item.data));
        })();
    }, [getAllCache]);

    return useMemo(() => new Fuse(announcements, searchOptions, Fuse.createIndex(announceSearchProperties, announcements)), [announcements]);
};

export const useGlobalSearchIndex = () => {
    const { getAllCache } = useDataCache();
    const [dealers, setDealers] = useState<DealerDetails[]>([]);
    const [events, setEvents] = useState<EventDetails[]>([]);
    const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntryDetails[]>([]);

    useEffect(() => {
        (async () => {
            const cachedDealers = await getAllCache<DealerDetails>("dealers");
            const cachedEvents = await getAllCache<EventDetails>("events");
            const cachedKb = await getAllCache<KnowledgeEntryDetails>("knowledgeEntries");
            setDealers(cachedDealers.map((item) => item.data));
            setEvents(cachedEvents.map((item) => item.data));
            setKnowledgeEntries(cachedKb.map((item) => item.data));
        })();
    }, [getAllCache]);

    const data: GlobalSearchResult[] = useMemo(() => {
        return [
            ...dealers.map((dealer) => ({ ...dealer, type: "dealer" })),
            ...events.map((event) => ({ ...event, type: "event" })),
            ...knowledgeEntries.map((entry) => ({ ...entry, type: "knowledgeEntry" })),
        ];
    }, [dealers, events, knowledgeEntries]);

    return useMemo(
        () =>
            new Fuse<GlobalSearchResult>(
                data,
                { ...searchOptions, threshold: 0.1 },
                Fuse.createIndex([...dealerSearchProperties, ...eventSearchProperties, ...kbSearchProperties] as FuseOptionKey<GlobalSearchResult>[], data),
            ),
        [data],
    );
};

export { searchOptions, dealerSearchProperties, eventSearchProperties, kbSearchProperties, announceSearchProperties };
