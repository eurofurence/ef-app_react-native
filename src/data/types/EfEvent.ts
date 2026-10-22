import type { EfEntity } from './EfEntity.ts'
import type { EfId } from './EfId.ts'
import type { DateTimeString } from './Primitives.ts'

export type EfEvent = EfEntity & {
  Slug?: string
  Title: string
  SubTitle?: string
  Abstract?: string
  ConferenceDayId?: EfId
  ConferenceTrackId?: EfId
  ConferenceRoomId?: EfId
  Description?: string
  Duration?: string
  StartTime?: string
  EndTime?: string
  StartDateTimeUtc: DateTimeString
  EndDateTimeUtc: DateTimeString
  PanelHosts?: string
  IsDeviatingFromConBook?: boolean
  IsAcceptingFeedback?: boolean
  BannerImageId?: EfId
  PosterImageId?: EfId
  Tags: string[]
  IsInternal: boolean
}
