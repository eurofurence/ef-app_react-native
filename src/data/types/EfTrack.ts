import type { EfEntity } from './EfEntity.ts'

export type EfTrack = EfEntity & {
  Name: string
  Description: string
  IsInternal: boolean
}
