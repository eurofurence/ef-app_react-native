import { TableRegistrationRecordStatus } from '@/context/data/types.api'
import { ThemeColor } from '@/context/Theme'

export const stateToBackground: Record<TableRegistrationRecordStatus, ThemeColor> = {
  Pending: 'warning',
  Accepted: 'primary',
  Published: 'primary',
  Rejected: 'notification',
} as const
