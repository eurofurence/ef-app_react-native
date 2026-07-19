import { useCallback } from 'react'
import { useAppSetting } from '@/data/collections/supplemental/AppSettings'

/**
 * Possible warning keys.
 */
export type WarningKey =
  | 'deviceWarningsHidden'
  | 'languageWarningsHidden'
  | 'timeZoneWarningsHidden'
  | 'registrationCountdownHidden'
  | 'badgeAvailableHidden'
  | 'calendarSyncHidden'

/**
 * Provides state and mutation for device warnings.
 * @param warningKey The warning key.
 */
export function useWarningState(warningKey: WarningKey) {
  const [warningsHidden, updateWarningsHidden] = useAppSetting('WarningsHidden')

  const isHidden = Boolean(warningsHidden?.[warningKey])

  const hideWarning = useCallback(() => {
    updateWarningsHidden((current) => ({ ...current, [warningKey]: true }))
  }, [warningKey])

  const showWarning = useCallback(() => {
    updateWarningsHidden((current) => ({ ...current, [warningKey]: false }))
  }, [warningKey])

  return {
    isHidden,
    hideWarning,
    showWarning,
  }
}
