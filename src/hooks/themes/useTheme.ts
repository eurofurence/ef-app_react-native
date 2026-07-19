import { useColorScheme } from 'react-native'

import { useAppSetting } from '@/data/collections/supplemental/AppSettings'

export function useTheme() {
  const systemTheme = useColorScheme()
  const [theme, setTheme] = useAppSetting('Theme')

  return {
    theme,
    setTheme,
    systemTheme,
  }
}
