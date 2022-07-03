import { DealerRecord, EnrichedDealerRecord, EnrichedImageRecord, EnrichedMapRecord, ImageRecord, ImageUrl, MapRecord } from "./eurofurence.types";

const createImageUrl = (imageId: string | undefined): ImageUrl | undefined => imageId && `https://app.eurofurence.org/EF26/Api/Images/${imageId}/Content`;

export const enrichDealerRecord = (record: DealerRecord): EnrichedDealerRecord => ({
    ...record,
    ArtistImageUrl: createImageUrl(record.ArtistImageId),
    ArtistThumbnailImageUrl: createImageUrl(record.ArtistThumbnailImageId),
    ArtPreviewImageUrl: createImageUrl(record.ArtPreviewImageId),
});

export const enrichMapRecord = (record: MapRecord): EnrichedMapRecord => ({
    ...record,
    ImageUrl: createImageUrl(record.ImageId),
});

export const enrichImageRecord = (record: ImageRecord): EnrichedImageRecord => ({
    ...record,
    ImageUrl: createImageUrl(record.Id),
});
