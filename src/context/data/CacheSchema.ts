import {
  AnnouncementRecord,
  DealerRecord,
  EventDayRecord,
  EventRecord,
  EventRoomRecord,
  EventTrackRecord,
  ImageRecord,
  KnowledgeEntryRecord,
  KnowledgeGroupRecord,
  MapRecord,
} from '@/context/data/types.api'
import { Notification } from '@/store/background/slice'
import { defineEntity, defineField } from '@/context/data/CacheTools'
import { eurofurenceCacheVersion, devMenu } from '@/configuration'
import { formatISO } from 'date-fns'
import { Settings } from '@/context/data/types.own'

/**
 * Storage schema for internal cache variables.
 */
export const schemaInternal = {
  /**
   * Convention ID for the data in the store.
   */
  cid: defineField<string>('none'),

  /**
   * Cache data version. If changed, format is different and needs to be
   * reloaded.
   */
  cacheVersion: defineField<number>(eurofurenceCacheVersion),

  /**
   * Last synchronized time.
   */
  lastSynchronised: defineField<string>(formatISO(0)),
} as const

/**
 * Internal definitions of the schema.
 */
export type SchemaInternal = typeof schemaInternal

/**
 * Storage schema for mutable values.
 */
export const schemaValues = {
  /**
   * User settings.
   */
  settings: defineField<Settings>({
    devMenu: devMenu,
  }),

  /**
   * Currently registered notifications (i.e., event reminders).
   */
  notifications: defineField<readonly Notification[]>([]),
} as const

/**
 * Value definitions of the schema.
 */
export type SchemaValues = typeof schemaValues

/**
 * Storage schema for synchronized entities.
 */
export const schemaEntities = {
  announcements: defineEntity<AnnouncementRecord>('Announcements', (item) => item.ValidFromDateTimeUtc, 'desc'),
  dealers: defineEntity<DealerRecord>('Dealers', (item) => item.DisplayNameOrAttendeeNickname),
  images: defineEntity<ImageRecord>('Images', (item) => item.ContentHashSha1),
  events: defineEntity<EventRecord>('Events', (item) => item.StartDateTimeUtc),
  eventDays: defineEntity<EventDayRecord>('EventConferenceDays', (item) => item.Date),
  eventRooms: defineEntity<EventRoomRecord>('EventConferenceRooms', (item) => item.Name),
  eventTracks: defineEntity<EventTrackRecord>('EventConferenceTracks', (item) => item.Name),
  knowledgeGroups: defineEntity<KnowledgeGroupRecord>('KnowledgeGroups', (item) => item.Order, 'desc'),
  knowledgeEntries: defineEntity<KnowledgeEntryRecord>('KnowledgeEntries', (item) => item.Order, 'desc'),
  maps: defineEntity<MapRecord>('Maps', (item) => item.Order),
} as const

/**
 * Entity definitions of the schema.
 */
export type SchemaEntities = typeof schemaEntities

/**
 * Combined schema, internal parts, direct values and entity values.
 */
export const schema = { ...schemaInternal, ...schemaValues, ...schemaEntities } as const

/**
 * Definition type of the schema.
 */
export type Schema = typeof schema
