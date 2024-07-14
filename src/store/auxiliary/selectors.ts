import { createSelector } from "@reduxjs/toolkit";

import { RecordId } from "../eurofurence/types";
import { RootState } from "../index";

export const selectLastViewed = createSelector([(state: RootState) => state.auxiliary.lastViewTimes, (_state, id: RecordId) => id], (lastViewedTimes, id): string | null => {
    return lastViewedTimes?.[id] ?? null;
});

export const selectHiddenEventIds = createSelector([(state: RootState) => state.auxiliary.hiddenEvents], (ids) => ids ?? []);

export const selectFavoriteDealerIds = createSelector([(state: RootState) => state.auxiliary.favoriteDealers], (ids) => ids ?? []);
