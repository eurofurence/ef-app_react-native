import type { EfEntity } from './EfEntity.ts'
import type { DateTimeString } from './Primitives.ts'

export type EfLostAndFound = EfEntity & {
  ExternalId: number
  ImageUrl: string
  Title: string
  Description: string
  Status: string
  LostDateTimeUtc: DateTimeString
  FoundDateTimeUtc: DateTimeString
  ReturnDateTimeUtc: DateTimeString
}
