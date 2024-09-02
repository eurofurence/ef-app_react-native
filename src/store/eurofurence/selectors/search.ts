import { createSelector } from "@reduxjs/toolkit";
import Fuse, { FuseOptionKey, IFuseOptions } from "fuse.js";
import { flatten } from "lodash";

import { selectDealersInAd, selectDealersInRegular } from "./dealers";
import { announcementsSelectors, dealersSelectors, eventsSelector, knowledgeEntriesSelectors } from "./records";
import { AnnouncementDetails, DealerDetails, EventDetails, KnowledgeEntryDetails } from "../types";

/**
 * Search options.
 */
const searchOptions: IFuseOptions<any> = {
    shouldSort: true,
    threshold: 0.25,
    ignoreLocation: true,
};

/**
 * Properties to use in search.
 */
const dealerSearchProperties: FuseOptionKey<DealerDetails>[] = [
    {
        name: "FullName",
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
export const selectDealersAllSearchIndex = createSelector([dealersSelectors.selectAll], (data) => new Fuse(data, searchOptions, Fuse.createIndex(dealerSearchProperties, data)));
export const selectDealersInRegularSearchIndex = createSelector([selectDealersInRegular], (data) => new Fuse(data, searchOptions, Fuse.createIndex(dealerSearchProperties, data)));
export const selectDealersInAdSearchIndex = createSelector([selectDealersInAd], (data) => new Fuse(data, searchOptions, Fuse.createIndex(dealerSearchProperties, data)));
/**
 * Properties to use in search.
 */
const eventSearchProperties: FuseOptionKey<EventDetails>[] = [
    {
        name: "Title",
        weight: 2,
    },
    {
        name: "SubTitle",
        weight: 1,
    },
    {
        name: "Abstract",
        weight: 0.5,
    },
    {
        name: "ConferenceRoom.Name",
        weight: 0.333,
    },
    {
        name: "ConferenceTrack.Name",
        weight: 0.333,
    },
    {
        name: "Abstract",
        weight: 0.5,
    },
    {
        name: "PanelHosts",
        weight: 0.1,
    },
];

export const selectEventsAllSearchIndex = createSelector([eventsSelector.selectAll], (data) => new Fuse(data, searchOptions, Fuse.createIndex(eventSearchProperties, data)));
/**
 * Properties to use in search.
 */
const kbSearchProperties: FuseOptionKey<KnowledgeEntryDetails>[] = [
    {
        name: "Title",
        weight: 1.5,
    },
    {
        name: "Text",
        weight: 1,
    },
];

export const selectKbAllSearchIndex = createSelector([knowledgeEntriesSelectors.selectAll], (data) => new Fuse(data, searchOptions, Fuse.createIndex(kbSearchProperties, data)));

export const selectGlobalSearchIndex = createSelector(
    [dealersSelectors.selectAll, eventsSelector.selectAll, knowledgeEntriesSelectors.selectAll],
    (dealers, events, knowledgeEntries) => {
        const data = [...dealers, ...events, ...knowledgeEntries];
        return new Fuse(
            data,
            { ...searchOptions, threshold: 0.1 },
            Fuse.createIndex(
                [
                    ...(dealerSearchProperties as FuseOptionKey<DealerDetails | EventDetails | KnowledgeEntryDetails>[]),
                    ...(eventSearchProperties as FuseOptionKey<DealerDetails | EventDetails | KnowledgeEntryDetails>[]),
                    ...(kbSearchProperties as FuseOptionKey<DealerDetails | EventDetails | KnowledgeEntryDetails>[]),
                ],
                data,
            ),
        );
    },
);
/**
 * Properties to use in search.
 */
const announceSearchProperties: FuseOptionKey<AnnouncementDetails>[] = [
    {
        name: "NormalizedTitle",
        weight: 1.5,
    },
    {
        name: "Content",
        weight: 1,
    },
    {
        name: "Author",
        weight: 0.5,
    },
    {
        name: "Area",
        weight: 0.5,
    },
];

export const selectAnnounceAllSearchIndex = createSelector(
    [announcementsSelectors.selectAll],
    (data) => new Fuse(data, searchOptions, Fuse.createIndex(announceSearchProperties, data)),
);
