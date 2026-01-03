import { useCallback } from 'react'

import { useCache } from '@/context/data/Cache'
import type { ArtistsAlleyLocal } from '@/context/data/types.own'

/**
 * Uses locally stored artists alley registration info to be used for repeat registrations.
 */
export function useArtistsAlleyLocalData() {
  const { getValue, setValue } = useCache()

  const localData = getValue('settings').artistsAlleyLocal
  const setLocalData = useCallback(
    (data: ArtistsAlleyLocal) => {
      const settings = getValue('settings')
      setValue('settings', {
        ...settings,
        artistsAlleyLocal: data,
      })
    },
    [getValue, setValue]
  )

  return { localData, setLocalData }
}
