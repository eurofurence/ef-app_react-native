export type RecordMetadata = {
    Id: string;
    LastChangeDateTimeUtc: string;
    IsDeleted: number;
};

export type AnnouncementRecord = RecordMetadata & {
    ValidFromDateTimeUtc: string;
    ValidUntilDateTimeUtc: string;
    ExternalReference?: string;
    Area: string;
    Author: string;
    Title: string;
    Content: string;
    ImageId: string;
};

export type EventRecord = RecordMetadata & {
    Title: string;
};

export type DealerRecord = RecordMetadata & {
    RegistrationNumber: number;
    ArtistImageId?: string;
    ArtistThumbnailImageId?: string;
    ArtPreviewImageId?: string;
};

export type EnrichedDealerRecord = DealerRecord & {
    ArtistImageUrl?: string;
    ArtistThumbnailImageUrl?: string;
    ArtPreviewImageUrl?: string;
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
};

export type KnowledgeGroupRecord = RecordMetadata & {
    Name: string;
};

export type KnowledgeEntryRecord = RecordMetadata & {
    Title: string;
    KnowledgeGroupId: string;
};
