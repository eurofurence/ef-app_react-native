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
    StartDateTimeUtc: DateTimeString;

    Slug?: string;
    SubTitle?: string;
    Abstract?: string;
    ConferenceDayId?: string;
    ConferenceTrackId?: string;
    ConferenceRoomId?: string;
    Description?: string;
    Duration?: string;
    StartTime?: string;
    EndTime?: string;
    EndDateTimeUtc?: string;
    PanelHosts?: string;
    IsDeviatingFromConBook?: boolean;
    IsAcceptingFeedback?: boolean;
    BannerImageId?: string;
    PosterImageId?: string;
    Tags?: string[];
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
    Name: string;
    Date: string;
};

export type EventTrackRecord = RecordMetadata & {
    Name?: string;
};

export type EventRoomRecord = RecordMetadata & {
    Name?: string;
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
    Description: string;
    Order: number;
    showInHamburgerMenu: boolean;
    FontAwesomeIconCharacterUnicodeAddress?: string;
};

export type KnowledgeEntryRecord = RecordMetadata & {
    Title: string;
    Text: string;
    Order: number;
    KnowledgeGroupId: RecordId;
};

export type ImageRecord = RecordMetadata & {
    ContentHashSha1: string;
};

export type EnrichedImageRecord = ImageRecord & {
    ImageUrl: ImageUrl;
};
