import { createSelector } from "@reduxjs/toolkit";

import { mapsSelectors } from "./records";
import { LinkFragment, MapDetails, MapEntryRecord, RecordId } from "../types";

export const filterBrowsableMaps = <T extends Pick<MapDetails, "IsBrowseable">>(maps: T[]) => maps.filter((it) => it.IsBrowseable);
export const selectBrowsableMaps = createSelector(mapsSelectors.selectAll, (state) => filterBrowsableMaps(state));
export const selectValidLinksByTarget = createSelector(
    [mapsSelectors.selectAll, (_state, target: RecordId) => target],
    (maps, target): { map: MapDetails; entry: MapEntryRecord; link: LinkFragment }[] => {
        const results = [];
        for (const map of maps) {
            for (const entry of map.Entries) {
                for (const link of entry.Links) {
                    if (target === link.Target) {
                        results.push({ map, entry, link });
                    }
                }
            }
        }
        return results;
    },
);
