import type { EfEntity } from './EfEntity.ts'
import type { EfId } from './EfId.ts'
import type { EfLink } from './EfLink.ts'

export type EfMapEntry = {
  Id: string
  X: number
  Y: number
  TapRadius: number
  Links: EfLink[]
}
export type EfMap = EfEntity & {
  Description: string
  Order: number
  IsBrowseable: boolean
  Entries: EfMapEntry[]
  ImageId: EfId
}
