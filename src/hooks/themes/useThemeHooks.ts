import { useMemo } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { useTheme as useThemeHook } from './useTheme'
import { ThemeColor, ThemeName, themes } from '@/context/Theme'

export const useThemeName = () => {
  const { theme, systemTheme } = useThemeHook()
  return theme ?? systemTheme ?? 'light'
}

export const useTheme = () => {
  const themeName = useThemeName()
  return useMemo(() => themes[themeName], [themeName])
}

/**
 * Creates an object that for each theme and each color therein contains a wrapped value calculated by the callback on
 * the theme color.
 * @param callback The color transformation.
 */
function createThemeDerivedValues<T>(callback: (color: string) => T): Record<ThemeName, Record<ThemeColor, T>> {
  return Object.fromEntries(
    Object.entries(themes).map(([themeName, theme]) => {
      return [
        themeName,
        Object.fromEntries(
          Object.entries(theme).map(([color, value]) => {
            return [color, callback(value)]
          })
        ),
      ]
    })
  ) as Record<ThemeName, Record<ThemeColor, T>>
}

export const useThemeColorValue = (color: ThemeColor) => useTheme()[color]

const colorStyles = createThemeDerivedValues<TextStyle>((color) => ({ color: color }))
const colorTransparent: TextStyle = { color: 'transparent' }
export function useThemeColor(color: ThemeColor | 'transparent'): Pick<TextStyle, 'color'> & { color: string }
export function useThemeColor(color: null): null
export function useThemeColor(color: ThemeColor | 'transparent' | null): (Pick<TextStyle, 'color'> & { color: string }) | null
export function useThemeColor(color: ThemeColor | 'transparent' | null) {
  const theme = useThemeName()
  if (color === null) return null
  if (color === 'transparent') return colorTransparent
  return colorStyles[theme][color]
}

const borderColorStyles = createThemeDerivedValues<ViewStyle>((color) => ({ borderColor: color }))
const borderTransparent: ViewStyle = { borderColor: 'transparent' }
export function useThemeBorder(color: ThemeColor | 'transparent'): Pick<ViewStyle, 'borderColor'> & { borderColor: string }
export function useThemeBorder(color: null): null
export function useThemeBorder(color: ThemeColor | 'transparent' | null): (Pick<ViewStyle, 'borderColor'> & { borderColor: string }) | null
export function useThemeBorder(color: ThemeColor | 'transparent' | null) {
  const theme = useThemeName()
  if (color === null) return null
  if (color === 'transparent') return borderTransparent
  return borderColorStyles[theme][color]
}

const backgroundColorStyles = createThemeDerivedValues<ViewStyle>((color) => ({ backgroundColor: color }))
const backgroundColorTransparent: ViewStyle = { backgroundColor: 'transparent' }
export function useThemeBackground(color: ThemeColor | 'transparent'): Pick<ViewStyle, 'backgroundColor'> & { backgroundColor: string }
export function useThemeBackground(color: null): null
export function useThemeBackground(color: ThemeColor | 'transparent' | null): (Pick<ViewStyle, 'backgroundColor'> & { backgroundColor: string }) | null
export function useThemeBackground(color: ThemeColor | 'transparent' | null) {
  const theme = useThemeName()
  if (color === null) return null
  if (color === 'transparent') return backgroundColorTransparent
  return backgroundColorStyles[theme][color]
}
