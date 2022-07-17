import moment, { MomentInput } from "moment";

import { apiBase } from "../configuration";
import {
    DealerRecord,
    EnrichedDealerRecord,
    EnrichedEventRecord,
    EnrichedImageRecord,
    EnrichedMapRecord,
    EventRecord,
    ImageRecord,
    ImageUrl,
    MapRecord,
} from "./eurofurence.types";

const internalCreateImageUrl = (imageId: string | undefined): ImageUrl | undefined => imageId && `${apiBase}/Images/${imageId}/Content`;

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

export const enrichMapRecord = (record: MapRecord): EnrichedMapRecord => ({
    ...record,
    ImageUrl: internalCreateImageUrl(record.ImageId),
});

export const enrichImageRecord = (record: ImageRecord): EnrichedImageRecord => ({
    ...record,
    ImageUrl: internalCreateImageUrl(record.Id),
});

export const enrichEventRecord = (record: EventRecord): EnrichedEventRecord => ({
    ...record,
    PartOfDay: internalCategorizeTime(record.StartDateTimeUtc),
    BannerImageUrl: internalCreateImageUrl(record.BannerImageId),
    PosterImageUrl: internalCreateImageUrl(record.PosterImageId),
});

/**
 * @deprecated Do not export and use this. Enrich a record here instead.
 */
export const createImageUrl = internalCreateImageUrl;
