import { useCallback } from 'react'
import { useColorScheme } from 'react-native'

import { useCache } from '@/context/data/Cache'
import { ThemeName } from '@/context/Theme'

export function useTheme() {
  const systemTheme = useColorScheme()
  const { data, setValue } = useCache()

  const theme = data.settings.theme

  const setTheme = useCallback(
    (newTheme: ThemeName | undefined) =>
      setValue('settings', (current) => ({
        ...current,
        theme: newTheme,
      })),
    [setValue]
  )

  return {
    theme,
    setTheme,
    systemTheme,
  }
}
