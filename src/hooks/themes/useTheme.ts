import { useColorScheme } from 'react-native'

import { useAppSetting } from '@/data/collections/AppSettings'

export function useTheme() {
  const systemTheme = useColorScheme()
  const [theme, setTheme] = useAppSetting('Theme')

  return {
    theme,
    setTheme,
    systemTheme,
  }
}
