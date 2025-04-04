import { useCache } from '@/context/data/DataCache'

/**
 * The key for the time offset.
 */
export const useTimeOffset = () => {
    const { getValue, setValue } = useCache()

    // Retrieve the cached time offset
    const getTimeOffset = () =>
        getValue('settings')?.timeTravelOffset ?? 0

    // Function to update the time offset in cache
    const setTimeOffset = (offset: number) =>
        setValue('settings', { ...(getValue('settings') ?? {}), timeTravelOffset: offset })

    return { getTimeOffset, setTimeOffset }
}
