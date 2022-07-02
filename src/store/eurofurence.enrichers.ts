import { DealerRecord, EnrichedDealerRecord } from "./eurofurence.types";

const createImageUrl = (imageId: string | undefined): string | undefined => imageId && `https://app.eurofurence.org/EF26/Api/Images/${imageId}/Content`;

export const enrichDealer = (record: DealerRecord): EnrichedDealerRecord => ({
    ...record,
    ArtistImageUrl: createImageUrl(record.ArtistImageId),
    ArtistThumbnailImageUrl: createImageUrl(record.ArtistThumbnailImageId),
    ArtPreviewImageUrl: createImageUrl(record.ArtPreviewImageId),
});
