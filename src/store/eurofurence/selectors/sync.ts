import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../../index";

export const selectIsSynchronized = createSelector(
    (state: RootState) => state.eurofurenceCache.state,
    (state) => state === "refreshing",
);
