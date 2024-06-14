import { createSelector } from "@reduxjs/toolkit";
import { chain } from "lodash";

import { mapsSelectors } from "./records";
import { LinkFragment, MapDetails, MapEntryRecord, RecordId } from "../types";

export const filterBrowsableMaps = <T extends Pick<MapDetails, "IsBrowseable">>(maps: T[]) => maps.filter((it) => it.IsBrowseable);
export const selectBrowsableMaps = createSelector(mapsSelectors.selectAll, (state) => filterBrowsableMaps(state));
export const selectValidLinksByTarget = createSelector(
    [mapsSelectors.selectAll, (_state, target: RecordId) => target],
    (maps, target): { map: MapDetails; entry: MapEntryRecord; link: LinkFragment }[] =>
        chain(maps)
            .flatMap((map) => map.Entries.map((entry) => ({ map, entry })))
            .flatMap(({ map, entry }) => entry.Links.map((link) => ({ map, entry, link })))
            .filter(({ link }) => target === link.Target)
            .value(),
);
