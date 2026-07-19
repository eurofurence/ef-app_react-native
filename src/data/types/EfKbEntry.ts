import type { EfEntity } from './EfEntity.ts'
import type { EfId } from './EfId.ts'
import type { EfLink } from './EfLink.ts'
import type { DateTimeString } from './Primitives.ts'

export type EfKbEntry = EfEntity & {
  KnowledgeGroupId: EfId
  Title: string
  Text: string
  Order: number
  Published?: DateTimeString
  Links: EfLink[]
  ImageIds: EfId[]
}
