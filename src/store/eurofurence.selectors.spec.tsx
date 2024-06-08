import moment from "moment";

import { filterActiveAnnouncements, filterBrowsableMaps, filterCurrentEvents, filterUpcomingEvents } from "./eurofurence.selectors";

describe("eurofurence.selectors", function () {
    describe("filterActiveAnnouncements", () => {
        it("returns active announcements", () => {
            const announcements = [{ Id: "test", ValidFromDateTimeUtc: moment("2022-01-01").toISOString(), ValidUntilDateTimeUtc: moment("2022-02-01").toISOString() }];
            const result = filterActiveAnnouncements(announcements, moment("2022-01-15"));

            expect(result).toHaveLength(1);
        });
        it("filters out inactive announcements", () => {
            const announcements = [
                { Id: "test", Area: "test", ValidFromDateTimeUtc: moment("2022-01-01").toISOString(), ValidUntilDateTimeUtc: moment("2022-02-01").toISOString() },
            ];
            const result = filterActiveAnnouncements(announcements, moment("2022-03-01"));

            expect(result).toHaveLength(0);
        });
    });

    describe("filterBrowseableMaps", () => {
        it("Selects browserable maps", () => {
            const maps = [{ Id: "1", IsBrowseable: true }];
            const result = filterBrowsableMaps(maps);

            expect(result).toHaveLength(1);
        });
        it("Does not select unbrowserable maps", () => {
            const maps = [{ Id: "1", IsBrowseable: false }];
            const result = filterBrowsableMaps(maps);

            expect(result).toHaveLength(0);
        });
    });

    describe("filterUpcomingEvents", () => {
        it("can filter upcoming events", () => {
            const result = filterUpcomingEvents([{ StartDateTimeUtc: moment().add(10, "minutes").toISOString() }], moment());

            expect(result).toHaveLength(1);
        });
        it("does not show an event more than 30 minutes in the future", () => {
            const result = filterUpcomingEvents([{ StartDateTimeUtc: moment().add(40, "minutes").toISOString() }], moment());

            expect(result).toHaveLength(0);
        });
        it("does not show an event in the past", () => {
            const result = filterUpcomingEvents([{ StartDateTimeUtc: moment().subtract(10, "minutes").toISOString() }], moment());

            expect(result).toHaveLength(0);
        });
    });

    describe("filterCurrentEvents", function () {
        it("selects event that are happening", () => {
            const result = filterCurrentEvents(
                [{ StartDateTimeUtc: moment().subtract(10, "minute").toISOString(), EndDateTimeUtc: moment().add(10, "minute").toISOString() }],
                moment(),
            );

            expect(result).toHaveLength(1);
        });
        it("does not select events in the past", () => {
            const result = filterCurrentEvents(
                [{ StartDateTimeUtc: moment().subtract(10, "minute").toISOString(), EndDateTimeUtc: moment().subtract(5, "minute").toISOString() }],
                moment(),
            );

            expect(result).toHaveLength(0);
        });
        it("does not select events in the future", () => {
            const result = filterCurrentEvents([{ StartDateTimeUtc: moment().add(5, "minute").toISOString(), EndDateTimeUtc: moment().add(10, "minute").toISOString() }], moment());

            expect(result).toHaveLength(0);
        });
    });
});
