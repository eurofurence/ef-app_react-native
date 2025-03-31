import { useEffect, useMemo, useState } from "react";
import Fuse, { FuseOptionKey, IFuseOptions } from "fuse.js";
import { flatten } from "lodash";
import { AnnouncementDetails, DealerDetails, EventDetails, KnowledgeEntryDetails } from "../types";
import { useDataCache } from "@/context/DataCacheProvider";

// ----- Search Options -----
const searchOptions: IFuseOptions<any> = {
    shouldSort: true,
    threshold: 0.25,
    ignoreLocation: true,
};

// ----- Dealer Search Properties -----
const dealerSearchProperties: FuseOptionKey<DealerDetails>[] = [
    { name: "DisplayNameOrAttendeeNickname", weight: 2 },
    { name: "Categories", weight: 1 },
    {
        name: "Keywords",
        getFn: (details) => (details.Keywords ? flatten(Object.values(details.Keywords)) : []),
        weight: 1,
    },
    { name: "ShortDescription", weight: 1 },
    { name: "AboutTheArtistText", weight: 1 },
    { name: "AboutTheArtText", weight: 1 },
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

// ----- Hooks using DataCacheProvider -----

export const useDealersSearchIndex = () => {
    const { getAllCache } = useDataCache();
    const [dealers, setDealers] = useState<DealerDetails[]>([]);

    useEffect(() => {
        (async () => {
            const cache = await getAllCache("dealers");
            setDealers(cache.map((item) => item.data));
        })();
    }, [getAllCache]);

    return useMemo(() => new Fuse(dealers, searchOptions, Fuse.createIndex(dealerSearchProperties, dealers)), [dealers]);
};

export const useEventsSearchIndex = () => {
    const { getAllCache } = useDataCache();
    const [events, setEvents] = useState<EventDetails[]>([]);

    useEffect(() => {
        (async () => {
            const cache = await getAllCache("events");
            setEvents(cache.map((item) => item.data));
        })();
    }, [getAllCache]);

    return useMemo(() => new Fuse(events, searchOptions, Fuse.createIndex(eventSearchProperties, events)), [events]);
};

export const useKbSearchIndex = () => {
    const { getAllCache } = useDataCache();
    const [entries, setEntries] = useState<KnowledgeEntryDetails[]>([]);

    useEffect(() => {
        (async () => {
            const cache = await getAllCache("knowledgeEntries");
            setEntries(cache.map((item) => item.data));
        })();
    }, [getAllCache]);

    return useMemo(() => new Fuse(entries, searchOptions, Fuse.createIndex(kbSearchProperties, entries)), [entries]);
};

export const useAnnounceSearchIndex = () => {
    const { getAllCache } = useDataCache();
    const [announcements, setAnnouncements] = useState<AnnouncementDetails[]>([]);

    useEffect(() => {
        (async () => {
            const cache = await getAllCache("announcements");
            setAnnouncements(cache.map((item) => item.data));
        })();
    }, [getAllCache]);

    return useMemo(() => new Fuse(announcements, searchOptions, Fuse.createIndex(announceSearchProperties, announcements)), [announcements]);
};

export type GlobalSearchResult = (DealerDetails & { type: "dealer" }) | (EventDetails & { type: "event" }) | (KnowledgeEntryDetails & { type: "knowledgeEntry" });

export const useGlobalSearchIndex = () => {
    const { getAllCache } = useDataCache();
    const [dealers, setDealers] = useState<DealerDetails[]>([]);
    const [events, setEvents] = useState<EventDetails[]>([]);
    const [entries, setEntries] = useState<KnowledgeEntryDetails[]>([]);

    useEffect(() => {
        (async () => {
            const dealerCache = await getAllCache("dealers");
            const eventsCache = await getAllCache("events");
            const kbCache = await getAllCache("knowledgeEntries");
            setDealers(dealerCache.map((item) => item.data));
            setEvents(eventsCache.map((item) => item.data));
            setEntries(kbCache.map((item) => item.data));
        })();
    }, [getAllCache]);

    const data: GlobalSearchResult[] = useMemo(() => {
        return [
            ...dealers.map((dealer) => ({ ...dealer, type: "dealer" as const })),
            ...events.map((event) => ({ ...event, type: "event" as const })),
            ...entries.map((entry) => ({ ...entry, type: "knowledgeEntry" as const })),
        ];
    }, [dealers, events, entries]);

    return useMemo(
        () =>
            new Fuse(
                data,
                { ...searchOptions, threshold: 0.1 },
                Fuse.createIndex([...dealerSearchProperties, ...eventSearchProperties, ...kbSearchProperties] as FuseOptionKey<GlobalSearchResult>[], data),
            ),
        [data],
    );
};
