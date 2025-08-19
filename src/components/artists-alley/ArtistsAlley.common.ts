import { useCallback } from 'react'

import { useCache } from '@/context/data/Cache'
import { ArtistsAlleyLocal } from '@/context/data/types.own'

/**
 * Uses locally stored artists alley registration info to be used for repeat registrations.
 */
export function useArtistsAlleyLocalData() {
  const { data, setValue } = useCache()

  const localData = data.settings.artistsAlleyLocal
  const setLocalData = useCallback(
    (value: ArtistsAlleyLocal) => {
      setValue('settings', (current) => ({
        ...current,
        artistsAlleyLocal: value,
      }))
    },
    [setValue]
  )

  return { localData, setLocalData }
}
