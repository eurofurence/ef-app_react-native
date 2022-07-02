/**
 * A URL leading to an image.
 */
export type ImageUrl = string | undefined;

/**
 * Named type to use when referencing other records.
 */
export type RecordId = string;

/**
 * A date as a UTC Date Time string;
 */
type DateTimeString = string;

export type RecordMetadata = {
    Id: RecordId;
    LastChangeDateTimeUtc: DateTimeString;
    IsDeleted: number;
};

export type AnnouncementRecord = RecordMetadata & {
    ValidFromDateTimeUtc: DateTimeString;
    ValidUntilDateTimeUtc: DateTimeString;
    ExternalReference?: string;
    Area: string;
    Author: string;
    Title: string;
    Content: string;
    ImageId: RecordId;
};

export type EventRecord = RecordMetadata & {
    Title: string;
};

export type DealerRecord = RecordMetadata & {
    RegistrationNumber: number;
    ArtistImageId?: RecordId;
    ArtistThumbnailImageId?: RecordId;
    ArtPreviewImageId?: RecordId;
};

export type EnrichedDealerRecord = DealerRecord & {
    ArtistImageUrl?: ImageUrl;
    ArtistThumbnailImageUrl?: ImageUrl;
    ArtPreviewImageUrl?: ImageUrl;
};

export type EventDayRecord = RecordMetadata & {
    Title: string;
};

export type EventTrackRecord = RecordMetadata & {
    Title: string;
};

export type EventRoomRecord = RecordMetadata & {
    Title: string;
};

export type MapRecord = RecordMetadata & {
    Description: string;
    IsBrowseable: boolean;
    ImageId?: RecordId;
};

export type EnrichedMapRecord = MapRecord & {
    ImageUrl?: ImageUrl;
};
export type KnowledgeGroupRecord = RecordMetadata & {
    Name: string;
};

export type KnowledgeEntryRecord = RecordMetadata & {
    Title: string;
    KnowledgeGroupId: RecordId;
};
