import { IconNames } from '@/components/generic/atoms/Icon'
import {
  AnnouncementRecord,
  CommunicationRecord,
  DealerRecord,
  EventDayRecord,
  EventRecord,
  EventRoomRecord,
  EventTrackRecord,
  ImageRecord,
  KnowledgeEntryRecord,
  KnowledgeGroupRecord,
  MapEntryRecord,
  MapRecord,
} from '@/context/data/types.api'

export type AnnouncementDetails = AnnouncementRecord & {
  ValidFrom: Date
  ValidFromLocal: Date
  ValidUntil: Date
  ValidUntilLocal: Date
  NormalizedTitle: string
  Image?: ImageDetails
}
/**
 * Time categorized in part of day.
 */
export type PartOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'long_running'
/**
 * Attendance day for dealers.
 */
export type AttendanceDay = 'mon' | 'tue' | 'wed'
export type EventDetails = EventRecord & {
  Hosts: string[]
  PartOfDay: PartOfDay
  Poster?: ImageDetails
  Banner?: ImageDetails
  Badges?: IconNames[]
  Glyph?: IconNames
  SuperSponsorOnly: boolean
  SponsorOnly: boolean
  MaskRequired: boolean
  ConferenceRoom?: EventRoomDetails
  ConferenceDay?: EventDayDetails
  ConferenceTrack?: EventTrackDetails
  Start: Date
  StartLocal: Date
  End: Date
  EndLocal: Date
  Favorite: boolean
  Hidden: boolean
}
export type DealerDetails = DealerRecord & {
  CategoryPrimary: string | null
  AttendanceDays: EventDayDetails[]
  AttendanceDayNames: AttendanceDay[]
  Artist?: ImageDetails
  ArtistThumbnail?: ImageDetails
  ArtPreview?: ImageDetails
  ShortDescriptionContent?: string
  ShortDescriptionTable?: string
  Favorite: boolean
  MastodonUrl?: string
}
export type EventDayDetails = EventDayRecord & {
  DayOfWeek: number
}
export type EventTrackDetails = EventTrackRecord
export type EventRoomDetails = EventRoomRecord
export type MapDetails = MapRecord & {
  Image?: ImageDetails
  Entries: MapEntryDetails[]
}
export type MapEntryDetails = MapEntryRecord
export type KnowledgeGroupDetails = KnowledgeGroupRecord
export type KnowledgeEntryDetails = KnowledgeEntryRecord & {
  Images: ImageDetails[]
}
export type ImageDetails = ImageRecord
export type CommunicationDetails = CommunicationRecord
