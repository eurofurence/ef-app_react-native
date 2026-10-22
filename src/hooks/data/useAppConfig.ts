import { useLiveQuery } from '@tanstack/react-db'
import { useMemo } from 'react'
import { appConfigCollection } from '@/data/collections/content/AppConfig'

import { type AppConfig, normalizeAppConfig } from '@/hooks/data/appConfig'

/**
 * Normalized, backend-provided app configuration cached from the sync response.
 */
export function useAppConfig(): AppConfig {
  const {
    data: [appConfig],
  } = useLiveQuery(appConfigCollection)
  return useMemo(() => normalizeAppConfig(appConfig ?? null), [appConfig])
}
