import { useMemo } from 'react'

import { useCache } from '@/context/data/Cache'
import { type AppConfig, normalizeAppConfig } from '@/hooks/data/appConfig'

/**
 * Normalized, backend-provided app configuration cached from the sync response.
 */
export function useAppConfig(): AppConfig {
  const appConfig = useCache().data.appConfig
  return useMemo(() => normalizeAppConfig(appConfig), [appConfig])
}
