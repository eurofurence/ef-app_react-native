import moment from "moment";

import eurofurenceCache from "./details.data.spec";
import { selectActiveAnnouncements } from "./selectors/announcements";
import { filterCurrentEvents, filterHappeningTodayEvents, filterUpcomingEvents, selectFavoriteEvents } from "./selectors/events";
import { selectBrowsableMaps } from "./selectors/maps";
import { announcementsSelectors, dealersSelectors, eventsSelector, mapsSelectors } from "./selectors/records";
import { EventDetails } from "./types";
import { RootState } from "../index";

const state: RootState = {
    eurofurenceCache,
    background: {
        notifications: [
            {
                type: "EventReminder",
                recordId: "0f502e78-406a-4efd-901b-fb32d65ea217",
                dateCreated: "",
                dateScheduled: "",
            },
        ],
    },
} as any;

describe("Eurofurence details", () => {
    describe("event selectors", () => {
        it("only return string IDs", () => {
            const results = eventsSelector.selectIds(state);
            const nonString = results.filter((result) => typeof result !== "string");

            expect(nonString).toHaveLength(0);
        });

        it("to convert banners", () => {
            const results = eventsSelector.selectAll(state);
            const unconverted = results.filter((result) => result.BannerImageId && !result.Banner);

            expect(unconverted).toHaveLength(0);
        });

        it("to convert posters", () => {
            const results = eventsSelector.selectAll(state);
            const unconverted = results.filter((result) => result.PosterImageId && !result.Poster);

            expect(unconverted).toHaveLength(0);
        });

        it("to compute part of day", () => {
            const results = eventsSelector.selectAll(state);
            const unmapped = results.filter((result) => !["morning", "afternoon", "evening", "night"].includes(result.PartOfDay));

            expect(unmapped).toHaveLength(0);
        });

        it("sponsors are detected", () => {
            const results = eventsSelector.selectAll(state);
            const undetectedSuperSponsors = results.filter((result) => result.Tags?.includes("supersponsors_only") && !result.SuperSponsorOnly);
            const undetectedSponsors = results.filter((result) => result.Tags?.includes("sponsors_only") && !result.SponsorOnly);

            expect(undetectedSuperSponsors).toHaveLength(0);
            expect(undetectedSponsors).toHaveLength(0);
        });

        it("badge is detected", () => {
            const results = eventsSelector.selectAll(state);
            const undetected = results.filter((result) => result.Tags?.includes("mask_required") && !result.MaskRequired);

            expect(undetected).toHaveLength(0);
        });

        it("has all metadata", () => {
            const results = eventsSelector.selectAll(state);
            const unannotated = results.filter((result) => !result.ConferenceDay || !result.ConferenceRoom || !result.ConferenceTrack);
            expect(unannotated).toHaveLength(0);
        });

        it("to memoize", () => {
            const resultsA = eventsSelector.selectAll(state);
            const resultsB = eventsSelector.selectAll(state);

            expect(resultsA).toStrictEqual(resultsB);
        });
    });

    describe("dealer selectors", () => {
        it("to convert artist image", () => {
            const results = dealersSelectors.selectAll(state);
            const unconverted = results.filter((result) => result.ArtistImageId && !result.Artist);

            expect(unconverted).toHaveLength(0);
        });

        it("to convert thumbnail image", () => {
            const results = dealersSelectors.selectAll(state);
            const unconverted = results.filter((result) => result.ArtistThumbnailImageId && !result.ArtistThumbnail);

            expect(unconverted).toHaveLength(0);
        });

        it("to convert preview image", () => {
            const results = dealersSelectors.selectAll(state);
            const unconverted = results.filter((result) => result.ArtPreviewImageId && !result.ArtPreview);

            expect(unconverted).toHaveLength(0);
        });

        it("aggregates days", () => {
            const results = dealersSelectors.selectAll(state);
            const unaggregated = results.filter(
                (result) =>
                    (result.AttendsOnThursday && !result.AttendanceDayNames.includes("mon")) ||
                    (result.AttendsOnFriday && !result.AttendanceDayNames.includes("tue")) ||
                    (result.AttendsOnSaturday && !result.AttendanceDayNames.includes("wed")),
            );

            expect(unaggregated).toHaveLength(0);
        });
    });

    describe("maps selectors", () => {
        it("has image with hashes", () => {
            const results = mapsSelectors.selectAll(state);
            const withoutHash = results.filter((result) => !result.Image?.FullUrl.includes("with-hash:"));

            expect(withoutHash).toHaveLength(0);
        });
    });

    describe("special selectors", () => {
        it("finds favorites", () => {
            const id = state.background.notifications.find((n) => n.type === "EventReminder")?.recordId ?? "";
            const event = eventsSelector.selectById(state, id) as EventDetails;

            const fav = selectFavoriteEvents(state);

            expect(fav).toContainEqual(event);
        });

        xit("finds upcoming favorites", () => {
            const id = state.background.notifications.find((n) => n.type === "EventReminder")?.recordId ?? "";
            const event = eventsSelector.selectById(state, id) as EventDetails;

            const faved = selectFavoriteEvents(state);
            const upcoming = filterHappeningTodayEvents(faved, moment(event.StartDateTimeUtc).subtract(1, "day"));
            const expired = filterHappeningTodayEvents(faved, moment(event.StartDateTimeUtc).add(1, "day"));

            expect(upcoming).toContainEqual(event);
            expect(expired).not.toContainEqual(event);
        });

        it("finds current", () => {
            const event = eventsSelector.selectAll(state)[0];

            const all = eventsSelector.selectAll(state);
            const current = filterCurrentEvents(all, moment(event.StartDateTimeUtc).add(1, "minute"));

            expect(current).toContainEqual(event);
        });

        it("finds upcoming", () => {
            const event = eventsSelector.selectAll(state)[0];

            const all = eventsSelector.selectAll(state);
            const upcoming = filterUpcomingEvents(all, moment(event.StartDateTimeUtc).subtract(20, "minutes"));

            expect(upcoming).toContainEqual(event);
        });

        it("finds active announcements", () => {
            const announcement = announcementsSelectors.selectAll(state)[0];

            const active = selectActiveAnnouncements(state, moment(announcement.ValidFromDateTimeUtc).add(1, "minute"));

            expect(active).toContainEqual(announcement);
        });

        it("finds browsable maps", () => {
            const notBrowsable = selectBrowsableMaps(state).filter((map) => !map.IsBrowseable);

            expect(notBrowsable).toHaveLength(0);
        });
    });
});
