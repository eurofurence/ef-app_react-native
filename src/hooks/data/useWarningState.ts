import { useCache } from '@/context/data/Cache'

/**
 * Possible warning keys.
 */
export type WarningKey = 'deviceWarningsHidden' | 'languageWarningsHidden' | 'timeZoneWarningsHidden' | 'registrationCountdownHidden'

/**
 * Provides state and mutation for device warnings.
 * @param warningKey The warning key.
 */
export function useWarningState(warningKey: WarningKey) {
  const { data, setValue } = useCache()
  const isHidden = data.settings.warnings?.[warningKey] === true

  const hideWarning = () =>
    setValue('settings', (current) => ({
      ...current,
      warnings: {
        ...(current.warnings ?? {}),
        [warningKey]: true,
      },
    }))
  const showWarning = () =>
    setValue('settings', (current) => ({
      ...current,
      warnings: {
        ...(current.warnings ?? {}),
        [warningKey]: false,
      },
    }))

  return {
    isHidden,
    hideWarning,
    showWarning,
  }
}
