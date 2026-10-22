import type { EfEntity } from './EfEntity.ts'

export type EfRoom = EfEntity & {
  Name: string
  Description: string
  MapLink: string
  IsInternal: boolean
  Capacity: number
}
