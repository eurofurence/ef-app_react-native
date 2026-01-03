import { useCallback } from 'react'
import { useColorScheme } from 'react-native'

import { useCache } from '@/context/data/Cache'
import type { ThemeName } from '@/context/Theme'

export function useTheme() {
  const systemTheme = useColorScheme()
  const { getValue, setValue } = useCache()
  const settings = getValue('settings')

  const theme = settings.theme

  const setTheme = useCallback(
    (newTheme: ThemeName | undefined) =>
      setValue('settings', {
        ...settings,
        theme: newTheme,
      }),
    [settings, setValue]
  )

  return {
    theme,
    setTheme,
    systemTheme,
  }
}
