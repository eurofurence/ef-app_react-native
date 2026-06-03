import {
  BasicIndex,
  createCollection,
  localStorageCollectionOptions,
  useLiveQuery,
  type WritableDeep,
} from '@tanstack/react-db'
import type { EfAppSettings } from '@/data/types/EfAppSettings'

export const appSettingsDefaults: EfAppSettings = {
  Theme: null,
  AnalyticsEnabled: false,
  Language: null,
  DevMenuEnabled: false,
  TimeTravelEnabled: false,
  TimeTravelOffset: 0,
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

export function appSettingsGet(): EfAppSettings {
  // Get singleton or fallback.
  return appSettingsCollection.get('singleton') ?? appSettingsDefaults
}

export function appSettingsUpdate(
  callback: (draft: WritableDeep<EfAppSettings>) => void
) {
  // Update existing.
  if (appSettingsCollection.has('singleton')) {
    return appSettingsCollection.update('singleton', callback)
  }

  // Insert new.
  const value = { ...appSettingsDefaults }
  callback(value)
  return appSettingsCollection.insert(value)
}

export function appSettingsReset() {
  // Delete singleton.
  return appSettingsCollection.delete('singleton')
}

export function useAppSettings() {
  return useLiveQuery(appSettingsCollection).data[0] ?? appSettingsDefaults
}
