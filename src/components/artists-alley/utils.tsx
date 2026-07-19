import type { ThemeColor } from '@/context/Theme'
import type {EfTableRegistrationStatus} from "@/data/types/EfTableRegistration";

export const stateToBackground: Record<
  EfTableRegistrationStatus,
  ThemeColor
> = {
  Pending: 'warning',
  Accepted: 'primary',
  Published: 'primary',
  Rejected: 'notification',
  CheckedOut: 'secondary',
} as const
