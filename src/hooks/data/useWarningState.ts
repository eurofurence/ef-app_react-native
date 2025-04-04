import { useCache } from '@/context/data/DataCache'

/**
 * Possible warning keys.
 */
export type WarningKey = 'deviceWarningsHidden' | 'languageWarningsHidden' | 'timeZoneWarningsHidden';

/**
 * Provides state and mutation for device warnings.
 * @param warningKey The warning key.
 */
export function useWarningState(warningKey: WarningKey) {
    const { getValue, setValue } = useCache()
    const settings = getValue('settings')
    const isHidden = settings?.warnings?.[warningKey] === true

    const hideWarning = () => setValue('settings', {
        ...(settings ?? {}),
        warnings: {
            ...(settings?.warnings ?? {}),
            [warningKey]: true,
        },
    })
    const showWarning = () => setValue('settings', {
        ...(settings ?? {}),
        warnings: {
            ...(settings?.warnings ?? {}),
            [warningKey]: false,
        },
    })

    return {
        isHidden,
        hideWarning,
        showWarning,
    }
}
