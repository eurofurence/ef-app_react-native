import type { EfEntity } from './EfEntity.ts'
import type { EfId } from './EfId.ts'
import type { DateTimeString } from './Primitives.ts'

export type EfAnnouncement = EfEntity & {
  ValidFromDateTimeUtc: DateTimeString
  ValidUntilDateTimeUtc: DateTimeString
  Area: string
  Author: string
  Title: string
  Content: string
  ImageId?: EfId
  Roles?: string[]
}
