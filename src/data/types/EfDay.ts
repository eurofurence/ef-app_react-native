import type { EfEntity } from './EfEntity.ts'

export type EfDay = EfEntity & {
  Name: string
  Date: string
  IsInternal: boolean
}
