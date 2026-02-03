import type { TableRegistrationRecordStatus } from '@/context/data/types.api'
import type { ThemeColor } from '@/context/Theme'

export const stateToBackground: Record<
  TableRegistrationRecordStatus,
  ThemeColor
> = {
  Pending: 'warning',
  Accepted: 'primary',
  Published: 'primary',
  Rejected: 'notification',
  CheckedOut: 'secondary',
} as const
