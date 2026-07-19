import type { EfEntity } from './EfEntity.ts'
import type { EfId } from './EfId.ts'
import type { DateTimeString } from './Primitives.ts'

export type EfArtistsAlley = EfEntity & {
  CreatedDateTimeUtc: DateTimeString
  DisplayName: string
  WebsiteUrl: string
  ShortDescription: string
  TelegramHandle: string
  Location: string
  ImageId?: EfId
}
