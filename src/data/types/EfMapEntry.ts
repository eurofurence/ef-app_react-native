import type { EfLink } from '@/data/types/EfLink'

export type EfMapEntry = {
  Id: string
  X: number
  Y: number
  TapRadius: number
  Links: EfLink[]
}
