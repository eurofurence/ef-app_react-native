import moment from "moment";

import { selectActiveAnnouncements, selectBrowseableMaps } from "./eurofurence.selectors";
import { AnnouncementRecord, ImageRecord, MapRecord, RecordId, RecordMetadata } from "./eurofurence.types";

const normalizeEntities = <T extends RecordMetadata>(items: T[]) => ({
    ids: items.map((it) => it.Id),
    entities: items.reduce((prev, curr) => {
        prev[curr.Id] = curr;
        return prev;
    }, {} as Record<RecordId, T>),
});

describe("eurofurence.selectors", function () {
    describe("selectActiveAnnouncements", () => {
        it("returns empty on empty", () => {
            const result = selectActiveAnnouncements(
                {
                    eurofurenceCache: {
                        announcements: normalizeEntities([]),
                    },
                } as any,
                moment()
            );

            expect(result).toHaveLength(0);
        });
        it("returns active announcements", () => {
            const announcements: Partial<AnnouncementRecord>[] = [
                { Id: "test", Area: "test", ValidFromDateTimeUtc: moment("2022-01-01").toISOString(), ValidUntilDateTimeUtc: moment("2022-02-01").toISOString() },
            ];
            const result = selectActiveAnnouncements(
                {
                    eurofurenceCache: {
                        announcements: normalizeEntities(announcements as AnnouncementRecord[]),
                    },
                } as any,
                moment("2022-01-15")
            );

            expect(result).toHaveLength(1);
        });
        it("filters out inactive announcements", () => {
            const announcements: Partial<AnnouncementRecord>[] = [
                { Id: "test", Area: "test", ValidFromDateTimeUtc: moment("2022-01-01").toISOString(), ValidUntilDateTimeUtc: moment("2022-02-01").toISOString() },
            ];
            const result = selectActiveAnnouncements(
                {
                    eurofurenceCache: {
                        announcements: normalizeEntities(announcements as AnnouncementRecord[]),
                    },
                } as any,
                moment("2022-03-01")
            );

            expect(result).toHaveLength(0);
        });
    });

    describe("selectBrowseableMaps", () => {
        it("selects browseable maps", () => {
            const images: Partial<ImageRecord>[] = [{ Id: "Test", ContentHashSha1: "no" }];
            const maps: Partial<MapRecord>[] = [
                {
                    Id: "Test",
                    IsBrowseable: true,
                    ImageId: "no",
                    Entries: [],
                },
            ];

            const result = selectBrowseableMaps({
                eurofurenceCache: {
                    maps: normalizeEntities(maps as MapRecord[]),
                    images: normalizeEntities(images as ImageRecord[]),
                },
            } as any);

            expect(result).toHaveLength(1);
        });
        it("does not select unbrowseable maps", () => {
            const images: Partial<ImageRecord>[] = [{ Id: "Test", ContentHashSha1: "no" }];

            const maps: Partial<MapRecord>[] = [
                {
                    Id: "Test",
                    IsBrowseable: false,
                    ImageId: "no",
                    Entries: [],
                },
            ];

            const result = selectBrowseableMaps({
                eurofurenceCache: {
                    maps: normalizeEntities(maps as MapRecord[]),
                    images: normalizeEntities(images as ImageRecord[]),
                },
            } as any);

            expect(result).toHaveLength(0);
        });
    });
});
