/**
 * A URL leading to an image.
 */
import { IconNames } from "../types/IconNames";

export type ImageUrl = string;

/**
 * Time categorized in part of day.
 */
export type PartOfDay = "morning" | "afternoon" | "evening" | "night";

/**
 * Attendance day for dealers.
 */
export type AttendanceDay = "thu" | "fri" | "sat";

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

    // TODO: Unverified API data type, carried from last version. Please review
    // as soon as a proper API specification is presented.
    Slug?: string;
    SubTitle?: string;
    Abstract?: string;
    ConferenceDayId?: string;
    ConferenceTrackId?: string;
    ConferenceRoomId?: string;
    Description?: string;
    Duration?: string;
    StartTime: string;
    StartDateTimeUtc: DateTimeString;
    EndTime: string;
    EndDateTimeUtc: DateTimeString;
    PanelHosts?: string;
    IsDeviatingFromConBook?: boolean;
    IsAcceptingFeedback?: boolean;
    BannerImageId?: string;
    PosterImageId?: string;
    Tags?: string[];
};

export type EnrichedEventRecord = EventRecord & {
    PartOfDay: PartOfDay;
    PosterImageUrl?: ImageUrl;
    BannerImageUrl?: ImageUrl;
    Glyph?: IconNames;
};

export type DealerRecord = RecordMetadata & {
    RegistrationNumber: number;
    ArtistImageId?: RecordId;
    ArtistThumbnailImageId?: RecordId;
    ArtPreviewImageId?: RecordId;

    // TODO: Unverified API data type, carried from last version. Please review
    // as soon as a proper API specification is presented.
    AttendeeNickname: string;
    DisplayName: string;
    Merchandise: string;
    ShortDescription?: string;
    AboutTheArtistText?: string;
    AboutTheArtText?: string;
    TwitterHandle?: string;
    TelegramHandle?: string;
    AttendsOnThursday?: boolean;
    AttendsOnFriday?: boolean;
    AttendsOnSaturday?: boolean;
    ArtPreviewCaption?: string;
    IsAfterDark?: boolean;
    Categories?: string[];
};

export type EnrichedDealerRecord = DealerRecord & {
    ArtistImageUrl?: ImageUrl;
    ArtistThumbnailImageUrl?: ImageUrl;
    ArtPreviewImageUrl?: ImageUrl;
    FullName: string;
};

export type EventDayRecord = RecordMetadata & {
    Name: string;
    Date: string;
};

export type EventTrackRecord = RecordMetadata & {
    Name: string;
};

export type EventRoomRecord = RecordMetadata & {
    Name: string;
};
export type EnrichedEventRoomRecord = EventRoomRecord & {
    LabelPart?: string;
    LocationPart?: string;
};

export type MapRecord = RecordMetadata & {
    // TODO: Verify nullability.
    Description: string;
    IsBrowseable: boolean;
    ImageId: RecordId;
    Entries: MapEntryRecord[];
};

export type MapEntryRecord = RecordMetadata & {
    // TODO: Verify nullability.
    X: number;
    Y: number;
    TapRadius: number;
    Links: LinkFragment[];
};

export type LinkFragment = {
    // TODO: Verify nullability.
    FragmentType: "WebExternal" | "MapExternal" | "MapEntry" | "DealerDetail" | "EventConferenceRoom";
    Name: string;
    Target: string;
};

export type EnrichedMapRecord = MapRecord & {
    ImageUrl: ImageUrl;
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

    // Needed because of downsampling.
    Width: number;
    Height: number;
};

export type EnrichedImageRecord = ImageRecord & {
    ImageUrl: ImageUrl;
};

export type CommunicationRecord = RecordMetadata & {
    RecipientUid: string;
    SenderUid?: string;
    CreatedDateTimeUtc: string;
    ReceivedDateTimeUtc?: string;
    ReadDateTimeUtc?: string;
    AuthorName?: string;
    Subject?: string;
    Message?: string;
};
