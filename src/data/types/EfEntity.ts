import type { EfId } from './EfId.ts'
import type { DateTimeString } from './Primitives.ts'

export type EfEntity = {
  Id: EfId
  LastChangeDateTimeUtc: DateTimeString
}
