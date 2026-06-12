import {
  BasicIndex,
  createCollection,
  localStorageCollectionOptions,
  useLiveQuery,
  type WritableDeep,
} from '@tanstack/react-db'
import { useCallback } from 'react'
import type { EfAppSettings } from '@/data/types/EfAppSettings'

export const appSettingsDefaults: EfAppSettings = {
  Theme: null,
  AnalyticsEnabled: false,
  Language: null,
  DevMenuEnabled: false,
  TimeTravelEnabled: false,
  TimeTravelOffset: 0,
  ShowInternalEvents: false,
}

export const appSettingsCollection = createCollection(
  localStorageCollectionOptions<EfAppSettings>({
    id: 'app-settings',
    storageKey: 'app-settings',
    getKey: () => 'singleton',
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

export function appSettingsUpdate(
  callback: (draft: WritableDeep<EfAppSettings>) => void
) {
  // Update existing.
  if (appSettingsCollection.has('singleton')) {
    return appSettingsCollection.update('singleton', callback)
  }

  // Insert new.
  const draft = { ...appSettingsDefaults }
  callback(draft)
  return appSettingsCollection.insert(draft)
}

export function useAppSettings() {
  const values =
    useLiveQuery(appSettingsCollection).data[0] ?? appSettingsDefaults
  const update = appSettingsUpdate
  return [values, update] as const
}

export function useAppSetting<T extends keyof EfAppSettings>(key: T) {
  const value = (useLiveQuery(appSettingsCollection).data[0] ??
    appSettingsDefaults)[key]
  const update = useCallback(
    (value: EfAppSettings[T]) => {
      appSettingsUpdate((draft) => {
        draft[key] = value
      })
    },
    [key]
  )

  return [value, update] as const
}
