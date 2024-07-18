import { createSelector } from "@reduxjs/toolkit";
import Fuse from "fuse.js";

import { selectDealersInAd, selectDealersInRegular } from "./dealers";
import { dealersSelectors, eventsSelector, knowledgeEntriesSelectors } from "./records";
import { DealerDetails, EventDetails, KnowledgeEntryDetails } from "../types";

/**
 * Properties to use in search.
 */
const dealerSearchProperties: Fuse.FuseOptionKey<DealerDetails>[] = [
    {
        name: "FullName",
        weight: 2,
    },
    {
        name: "Categories",
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
/**
 * Search options.
 */
const dealerSearchOptions: Fuse.IFuseOptions<DealerDetails> = {
    shouldSort: true,
    threshold: 0.3,
};
export const selectDealersAllSearchIndex = createSelector(
    [dealersSelectors.selectAll],
    (data) => new Fuse(data, dealerSearchOptions, Fuse.createIndex(dealerSearchProperties, data)),
);
export const selectDealersInRegularSearchIndex = createSelector(
    [selectDealersInRegular],
    (data) => new Fuse(data, dealerSearchOptions, Fuse.createIndex(dealerSearchProperties, data)),
);
export const selectDealersInAdSearchIndex = createSelector([selectDealersInAd], (data) => new Fuse(data, dealerSearchOptions, Fuse.createIndex(dealerSearchProperties, data)));
/**
 * Properties to use in search.
 */
const eventSearchProperties: Fuse.FuseOptionKey<EventDetails>[] = [
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
/**
 * Search options.
 */
const eventSearchOptions: Fuse.IFuseOptions<EventDetails> = {
    shouldSort: true,
    threshold: 0.3,
};
export const selectEventsAllSearchIndex = createSelector([eventsSelector.selectAll], (data) => new Fuse(data, eventSearchOptions, Fuse.createIndex(eventSearchProperties, data)));
/**
 * Properties to use in search.
 */
const kbSearchProperties: Fuse.FuseOptionKey<KnowledgeEntryDetails>[] = [
    {
        name: "Title",
        weight: 1.5,
    },
    {
        name: "Text",
        weight: 1,
    },
];
/**
 * Search options.
 */
const kbSearchOptions: Fuse.IFuseOptions<KnowledgeEntryDetails> = {
    shouldSort: true,
    threshold: 0.3,
};
export const selectKbAllSearchIndex = createSelector([knowledgeEntriesSelectors.selectAll], (data) => new Fuse(data, kbSearchOptions, Fuse.createIndex(kbSearchProperties, data)));
