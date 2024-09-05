/**
 * A URL leading to an image.
 */
import { IconNames } from "../../components/generic/atoms/Icon";

/**
 * Time categorized in part of day.
 */
export type PartOfDay = "morning" | "afternoon" | "evening" | "night";

/**
 * Attendance day for dealers.
 */
export type AttendanceDay = "mon" | "tue" | "wed";

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
    ImageId?: RecordId;
};

export type AnnouncementDetails = AnnouncementRecord & {
    NormalizedTitle: string;
    Image?: ImageDetails;
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

export type EventDetails = EventRecord & {
    PartOfDay: PartOfDay;
    Poster?: ImageDetails;
    Banner?: ImageDetails;
    Badges?: IconNames[];
    Glyph?: IconNames;
    SuperSponsorOnly: boolean;
    SponsorOnly: boolean;
    MaskRequired: boolean;
    ConferenceRoom?: EventRoomDetails;
    ConferenceDay?: EventDayDetails;
    ConferenceTrack?: EventTrackDetails;
    Favorite: boolean;
    Hidden: boolean;
};

export type DealerRecord = RecordMetadata & {
    ArtistImageId?: RecordId;
    ArtistThumbnailImageId?: RecordId;
    ArtPreviewImageId?: RecordId;

    DisplayNameOrAttendeeNickname: string;
    DisplayName: string;
    Merchandise: string;
    ShortDescription?: string;
    AboutTheArtistText?: string;
    AboutTheArtText?: string;
    TwitterHandle?: string;
    TelegramHandle?: string;
    DiscordHandle?: string;
    MastodonHandle?: string;
    BlueskyHandle?: string;
    Links: LinkFragment[] | null;
    AttendsOnThursday?: boolean;
    AttendsOnFriday?: boolean;
    AttendsOnSaturday?: boolean;
    ArtPreviewCaption?: string;
    IsAfterDark?: boolean;
    Categories?: string[];
    Keywords?: { [category: string]: string[] };
};

export type DealerDetails = DealerRecord & {
    AttendanceDays: EventDayDetails[];
    AttendanceDayNames: string[];
    Artist?: ImageDetails;
    ArtistThumbnail?: ImageDetails;
    ArtPreview?: ImageDetails;
    ShortDescriptionContent?: string;
    ShortDescriptionTable?: string;
    Favorite: boolean;
    MastodonUrl?: string;
};

export type EventDayRecord = RecordMetadata & {
    Name: string;
    Date: string;
};

export type EventDayDetails = EventDayRecord & {
    dayOfWeek: number;
};

export type EventTrackRecord = RecordMetadata & {
    Name: string;
};

export type EventTrackDetails = EventTrackRecord & object;

export type EventRoomRecord = RecordMetadata & {
    Name: string;
    ShortName?: string;
};

export type EventRoomDetails = EventRoomRecord & object;

export type MapRecord = RecordMetadata & {
    // TODO: Verify nullability.
    Description: string;
    IsBrowseable: boolean;
    ImageId: RecordId;
    Entries: MapEntryRecord[];
    Order: number;
};

export type MapDetails = MapRecord & {
    Image?: ImageDetails;
    Entries: MapEntryDetails[];
};

export type MapEntryRecord = RecordMetadata & {
    // TODO: Verify nullability.
    X: number;
    Y: number;
    TapRadius: number;
    Links: LinkFragment[];
};

export type MapEntryDetails = MapEntryRecord & object;

export type LinkFragment = {
    // TODO: Verify nullability.
    FragmentType: "WebExternal" | "MapExternal" | "MapEntry" | "DealerDetail" | "EventConferenceRoom";
    Name: string;
    Target: string;
};

export type KnowledgeGroupRecord = RecordMetadata & {
    Name: string;
    Description: string;
    Order: number;
    showInHamburgerMenu: boolean;
    FontAwesomeIconName?: string;
};

export type KnowledgeGroupDetails = KnowledgeGroupRecord & object;

export type KnowledgeEntryRecord = RecordMetadata & {
    Title: string;
    Text: string;
    Order: number;
    KnowledgeGroupId: RecordId;
    Links: LinkFragment[];
    ImageIds: RecordId[];
};

export type KnowledgeEntryDetails = KnowledgeEntryRecord & object;

export type ImageRecord = RecordMetadata & {
    InternalReference: string;
    Width: number;
    Height: number;
    SizeInBytes: number;
    MimeType: string;
    ContentHashSha1: string;
    Url: string;
};

export type ImageDetails = ImageRecord & object;

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

export type UserRecord = {
    Roles: string[];
    Registrations: {
        Id: string;
        Status: string;
    }[];
};

export type ArtistAlleyOwnTableRegistrationRecord = {
    LastChangeDateTimeUtc: string;
    Id: string;
    CreatedDateTimeUtc: string;
    OwnerUid: string;
    OwnerUsername: string;
    DisplayName: string;
    WebsiteUrl: string;
    ShortDescription: string;
    TelegramHandle: string;
    Location: string;
    ImageId: string;
    Image: ImageRecord;
    State: string;
};
