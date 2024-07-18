import { createSelector } from "@reduxjs/toolkit";
import { Moment } from "moment/moment";

import { announcementsSelectors } from "./records";
import { AnnouncementDetails } from "../types";

export const filterActiveAnnouncements = <T extends Pick<AnnouncementDetails, "ValidUntilDateTimeUtc" | "ValidFromDateTimeUtc">>(announcements: T[], now: Moment) =>
    announcements.filter((it) => now.isBetween(it.ValidFromDateTimeUtc, it.ValidUntilDateTimeUtc, "minute"));
export const selectActiveAnnouncements = createSelector([announcementsSelectors.selectAll, (_state, now: Moment) => now], (announcements, now) =>
    filterActiveAnnouncements(announcements, now),
);
