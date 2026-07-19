import type { IconNames } from '@/components/generic/atoms/Icon'
import type { EfEntity } from './EfEntity.ts'

export type EfKbGroup = EfEntity & {
  Name: string
  Description: string
  Order: number
  ShowInHamburgerMenu: boolean
  FontAwesomeIconName: IconNames
}
