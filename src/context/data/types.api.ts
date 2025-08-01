/**
 * Named type to use when referencing other records.
 */
export type RecordId = string
/**
 * A date as a UTC Date Time string;
 */
type DateTimeString = string

export type RecordMetadata = {
  Id: RecordId
  LastChangeDateTimeUtc: DateTimeString
  IsDeleted: number
}
export type AnnouncementRecord = RecordMetadata & {
  ValidFromDateTimeUtc: DateTimeString
  ValidUntilDateTimeUtc: DateTimeString
  ExternalReference?: string
  Area: string
  Author: string
  Title: string
  Content: string
  ImageId?: RecordId
}
export type EventRecord = RecordMetadata & {
  Title: string

  // TODO: Unverified API data type, carried from last version. Please review
  // as soon as a proper API specification is presented.
  Slug?: string
  SubTitle?: string
  Abstract?: string
  ConferenceDayId?: string
  ConferenceTrackId?: string
  ConferenceRoomId?: string
  Description?: string
  Duration?: string
  StartTime: string
  StartDateTimeUtc: DateTimeString
  EndTime: string
  EndDateTimeUtc: DateTimeString
  PanelHosts?: string
  IsDeviatingFromConBook?: boolean
  IsAcceptingFeedback?: boolean
  BannerImageId?: string
  PosterImageId?: string
  MapLink?: string
  Tags?: string[]
}
export type DealerRecord = RecordMetadata & {
  ArtistImageId?: RecordId
  ArtistThumbnailImageId?: RecordId
  ArtPreviewImageId?: RecordId

  DisplayNameOrAttendeeNickname: string
  DisplayName: string
  Merchandise: string
  ShortDescription?: string
  AboutTheArtistText?: string
  AboutTheArtText?: string
  TwitterHandle?: string
  TelegramHandle?: string
  DiscordHandle?: string
  MastodonHandle?: string
  BlueskyHandle?: string
  Links: LinkFragment[] | null
  AttendsOnThursday?: boolean
  AttendsOnFriday?: boolean
  AttendsOnSaturday?: boolean
  ArtPreviewCaption?: string
  IsAfterDark?: boolean
  Categories?: string[]
  MapLink?: string
  Keywords?: { [category: string]: string[] }
}
export type EventDayRecord = RecordMetadata & {
  Name: string
  Date: string
}
export type EventTrackRecord = RecordMetadata & {
  Name: string
}
export type EventRoomRecord = RecordMetadata & {
  Name: string
  ShortName?: string
}
export type MapRecord = RecordMetadata & {
  // TODO: Verify nullability.
  Description: string
  IsBrowseable: boolean
  ImageId: RecordId
  Entries: MapEntryRecord[]
  Order: number
}
export type MapEntryRecord = RecordMetadata & {
  // TODO: Verify nullability.
  X: number
  Y: number
  TapRadius: number
  Links: LinkFragment[]
}
export type LinkFragment = {
  // TODO: Verify nullability.
  FragmentType: 'WebExternal' | 'MapExternal' | 'MapEntry' | 'DealerDetail' | 'EventConferenceRoom'
  Name: string
  Target: string
}
export type KnowledgeGroupRecord = RecordMetadata & {
  Name: string
  Description: string
  Order: number
  showInHamburgerMenu: boolean
  FontAwesomeIconName?: string
}
export type KnowledgeEntryRecord = RecordMetadata & {
  Title: string
  Text: string
  Order: number
  KnowledgeGroupId: RecordId
  Links: LinkFragment[]
  ImageIds: RecordId[]
}
export type ImageRecord = RecordMetadata & {
  InternalReference: string
  Width: number
  Height: number
  SizeInBytes: number
  MimeType: string
  ContentHashSha1: string
  Url: string
}
export type CommunicationRecord = RecordMetadata & {
  RecipientUid: string
  SenderUid?: string
  CreatedDateTimeUtc: string
  ReceivedDateTimeUtc?: string
  ReadDateTimeUtc?: string
  AuthorName?: string
  Subject?: string
  Message?: string
}
export type UserRecord = {
  Roles: string[]
  Registrations: {
    Id: string
    Status: string
  }[]
}
export type TableRegistrationRecordStatus = 'Pending' | 'Accepted' | 'Published' | 'Rejected'

export type TableRegistrationRecord = {
  LastChangeDateTimeUtc: string
  Id: string
  CreatedDateTimeUtc: string
  OwnerUid: string
  OwnerUsername: string
  DisplayName: string
  WebsiteUrl: string
  ShortDescription: string
  TelegramHandle: string
  Location: string
  ImageId: string
  Image: ImageRecord
  State: TableRegistrationRecordStatus
}

export type LostAndFoundRecord = RecordMetadata & {
  ExternalId: number
  ImageUrl?: string
  Title: string
  Description?: string
  Status: 'Unknown' | 'Lost' | 'Found' | 'Returned'
  LostDateTimeUtc?: string
  FoundDateTimeUtc?: string
  ReturnDateTimeUtc?: string
}
