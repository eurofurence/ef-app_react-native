import moment, { MomentInput } from "moment";

import { apiBase } from "../configuration";
import { IconNames } from "../types/IconNames";
import {
    DealerRecord,
    EnrichedDealerRecord,
    EnrichedEventRecord,
    EnrichedEventRoomRecord,
    EnrichedImageRecord,
    EnrichedMapRecord,
    EventRecord,
    EventRoomRecord,
    ImageRecord,
    ImageUrl,
    MapRecord,
} from "./eurofurence.types";

/**
 * Creates an image URL, if the input can be undefined, the outut can also be undefined.
 * @param imageId
 */
const internalCreateImageUrl = <T extends string | undefined>(imageId: T): T extends undefined ? ImageUrl | undefined : ImageUrl =>
    imageId && `${apiBase}/Images/${imageId}/Content`;

const internalCategorizeTime = (input: MomentInput) => {
    const hours = moment(input).hours();
    if (6 <= hours && hours < 13) return "morning";
    if (13 <= hours && hours < 17) return "afternoon";
    if (17 <= hours && hours < 21) return "evening";
    return "night";
};

export const enrichDealerRecord = (record: DealerRecord): EnrichedDealerRecord => ({
    ...record,
    ArtistImageUrl: internalCreateImageUrl(record.ArtistImageId),
    ArtistThumbnailImageUrl: internalCreateImageUrl(record.ArtistThumbnailImageId),
    ArtPreviewImageUrl: internalCreateImageUrl(record.ArtPreviewImageId),
    // The full name uses logical instead of defined-ness based cut, as the display name is
    // sometimes given as empty, which is defined but not wanted.
    FullName: record.DisplayName || record.AttendeeNickname,
});

const matchRoomRecordParts = /(\P{Pd}+)\p{Pd}(\P{Pd}+)/u;

export const enrichRoomRecord = (record: EventRoomRecord): EnrichedEventRoomRecord => {
    const match = matchRoomRecordParts.exec(record.Name);
    const labelPart = match ? match[1].trim() : undefined;
    const locationPart = match ? match[2].trim() : undefined;
    return {
        ...record,
        LabelPart: labelPart,
        LocationPart: locationPart,
    };
};
export const enrichMapRecord = (record: MapRecord): EnrichedMapRecord => ({
    ...record,
    ImageUrl: internalCreateImageUrl(record.ImageId),
});

export const enrichImageRecord = (record: ImageRecord): EnrichedImageRecord => ({
    ...record,
    ImageUrl: internalCreateImageUrl(record.Id),
});

const tagsToIcon = (tags?: string[]): IconNames | undefined => {
    if (!tags) return;
    if (tags.includes("supersponsors_only")) return "star-circle";
    if (tags.includes("sponsors_only")) return "star";
    if (tags.includes("kage")) return "bug";
    if (tags.includes("art_show")) return "image-frame";
    if (tags.includes("dealers_den")) return "shopping";
    if (tags.includes("main_stage")) return "bank";
    if (tags.includes("photoshoot")) return "camera";
};

export const enrichEventRecord = (record: EventRecord): EnrichedEventRecord => ({
    ...record,
    PartOfDay: internalCategorizeTime(record.StartDateTimeUtc),
    BannerImageUrl: internalCreateImageUrl(record.BannerImageId),
    PosterImageUrl: internalCreateImageUrl(record.PosterImageId),
    Glyph: tagsToIcon(record.Tags),
});

/**
 * @deprecated Do not export and use this. Enrich a record here instead.
 */
export const createImageUrl = internalCreateImageUrl;
