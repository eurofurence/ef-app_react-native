import {
  BasicIndex,
  createCollection,
  useLiveQuery,
  type WritableDeep,
} from '@tanstack/react-db'
import { useCallback } from 'react'
import { queryClient } from '@/data/clients/query'
import { createAsyncStorageCollectionOptions } from '@/data/collections/createAsyncStorageCollectionOptions'
import type { EfAppSettings } from '@/data/types/EfAppSettings'

export const appSettingsDefaults: EfAppSettings = {
  Theme: null,
  AnalyticsEnabled: false,
  Language: null,
  DevMenuEnabled: false,
  TimeTravelEnabled: false,
  TimeTravelOffset: 0,
  ShowInternalEvents: false,
  WarningsHidden: {},
  ArtistsAlleyDisplayName: null,
  ArtistsAlleyWebsiteUrl: null,
  ArtistsAlleyShortDescription: null,
  ArtistsAlleyTelegramHandle: null,
}

export const appSettingsCollection = createCollection(
  createAsyncStorageCollectionOptions<EfAppSettings>({
    queryClient,
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
    (value: EfAppSettings[T] | ((current: EfAppSettings[T]) => EfAppSettings[T])) => {
      appSettingsUpdate((draft) => {
        draft[key] = value instanceof Function ? value(draft[key]) : value
      })
    },
    [key]
  )

  return [value, update] as const
}
