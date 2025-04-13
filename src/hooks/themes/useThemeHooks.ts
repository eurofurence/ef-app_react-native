import { useMemo } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { useTheme as useThemeHook } from './useTheme'
import { ThemeColor, themes } from '@/context/Theme'

export const useThemeName = () => {
  const { theme, systemTheme } = useThemeHook()
  return theme ?? systemTheme ?? 'light'
}

export const useTheme = () => {
  const themeName = useThemeName()
  return useMemo(() => themes[themeName], [themeName])
}

export const useThemeColorValue = (color: ThemeColor) => useTheme()[color]

export function useThemeColor(color: ThemeColor | 'transparent'): Pick<TextStyle, 'color'> & { color: string }
export function useThemeColor(color: null): null
export function useThemeColor(color: ThemeColor | 'transparent' | null): (Pick<TextStyle, 'color'> & { color: string }) | null
export function useThemeColor(color: ThemeColor | 'transparent' | null) {
  const theme = useTheme()
  return useMemo(() => (color ? { color: color === 'transparent' ? 'transparent' : theme[color] } : null), [theme, color])
}

export function useThemeBorder(color: ThemeColor | 'transparent'): Pick<ViewStyle, 'borderColor'> & { borderColor: string }
export function useThemeBorder(color: null): null
export function useThemeBorder(color: ThemeColor | 'transparent' | null): (Pick<ViewStyle, 'borderColor'> & { borderColor: string }) | null
export function useThemeBorder(color: ThemeColor | 'transparent' | null) {
  const theme = useTheme()
  return useMemo(() => (color ? { borderColor: color === 'transparent' ? 'transparent' : theme[color] } : null), [theme, color])
}

export function useThemeBackground(color: ThemeColor | 'transparent'): Pick<ViewStyle, 'backgroundColor'> & { backgroundColor: string }
export function useThemeBackground(color: null): null
export function useThemeBackground(color: ThemeColor | 'transparent' | null): (Pick<ViewStyle, 'backgroundColor'> & { backgroundColor: string }) | null
export function useThemeBackground(color: ThemeColor | 'transparent' | null) {
  const theme = useTheme()
  return useMemo(() => (color ? { backgroundColor: color === 'transparent' ? 'transparent' : theme[color] } : null), [theme, color])
}
