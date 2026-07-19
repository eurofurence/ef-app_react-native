import type { EfMapEntry } from '@/data/types/EfMapEntry'
import type { EfEntity } from './EfEntity.ts'
import type { EfId } from './EfId.ts'

export type EfMap = EfEntity & {
  Description: string
  Order: number
  IsBrowseable: boolean
  Entries?: EfMapEntry[]
  ImageId?: EfId
}
