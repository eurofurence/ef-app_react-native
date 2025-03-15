import { createSelector } from "@reduxjs/toolkit";

import { RecordId } from "../eurofurence/types";
import { RootState } from "../index";

export const selectLastViewedUtc = createSelector(
    [(state: RootState) => state.auxiliary.lastViewTimesUtc, (_state, id: RecordId) => id],
    (lastViewedTimesUtc, id): string | null => {
        return lastViewedTimesUtc?.[id] ?? null;
    },
);

export const selectHiddenEventIds = createSelector([(state: RootState) => state.auxiliary.hiddenEvents], (ids) => ids ?? []);

export const selectFavoriteDealerIds = createSelector([(state: RootState) => state.auxiliary.favoriteDealers], (ids) => ids ?? []);
