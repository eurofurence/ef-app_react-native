import { createSelector } from "@reduxjs/toolkit";
import moment, { Moment } from "moment/moment";

import { AnnouncementDetails } from "../types";
import { announcementsSelectors } from "./records";

export const filterActiveAnnouncements = <T extends Pick<AnnouncementDetails, "ValidUntilDateTimeUtc" | "ValidFromDateTimeUtc">>(announcements: T[], now: Moment) =>
    announcements.filter((it) =>
        now.isBetween(
            // Valid from time, allow a bit of slack because our input time is not precise.
            moment.utc(it.ValidFromDateTimeUtc).subtract(5, "minutes"),
            // Until time,  allow a bit of slack because our input time is not precise.
            moment.utc(it.ValidUntilDateTimeUtc).add(5, "minutes"),
            "minute",
        ),
    );

export const selectActiveAnnouncements = createSelector([announcementsSelectors.selectAll, (_state, now: Moment) => now], (announcements, now) =>
    filterActiveAnnouncements(announcements, now),
);
