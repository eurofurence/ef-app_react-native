import { useMemo } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { mapValues } from 'lodash'
import { ThemeColor, ThemeName, themes } from '@/context/Theme'
import { useCache } from '@/context/data/DataCache'

export const useAppliedTheme = (): ThemeName => {
    const { getValue } = useCache()
    return getValue('settings')?.theme ?? 'light'
}

export const useTheme = () => {
    const themeName = useAppliedTheme()
    return useMemo(() => themes[themeName], [themeName])
}

export const useColorStyle = () => {
    const themeName = useAppliedTheme()
    return useMemo(() => {
        const style: Record<string, TextStyle> = {}
        style.transparent = { color: 'transparent' }
        for (const [key, color] of Object.entries(themes[themeName])) {
            style[key] = { color }
        }
        return style as Record<ThemeColor | 'transparent', Pick<TextStyle, 'color'>>
    }, [themeName])
}

export const useBorderStyle = () => {
    const themeName = useAppliedTheme()
    return useMemo(() => {
        const style: Record<string, ViewStyle> = {}
        style.transparent = { backgroundColor: 'transparent' }
        for (const [key, color] of Object.entries(themes[themeName])) {
            style[key] = { borderColor: color }
        }
        return style as Record<ThemeColor | 'transparent', Pick<ViewStyle, 'borderColor'>>
    }, [themeName])
}

export const useBackgroundStyle = () => {
    const themeName = useAppliedTheme()
    return useMemo(() => {
        const style: Record<string, ViewStyle> = {}
        style.transparent = { backgroundColor: 'transparent' }
        for (const [key, color] of Object.entries(themes[themeName])) {
            style[key] = { backgroundColor: color }
        }
        return style as Record<ThemeColor | 'transparent', Pick<ViewStyle, 'backgroundColor'>>
    }, [themeName])
}

/**
 * Assigns line heights by factor for styles that have font size but no line height.
 * @param styles The styles to map.
 * @param factor The factor to apply.
 */
const deriveLineHeights = <T extends { fontSize?: number; lineHeight?: number }>(styles: Record<string, T>, factor = 1.25) =>
    mapValues(styles, (style) => {
        if (style.fontSize === undefined || style.lineHeight !== undefined) return style
        return { ...style, lineHeight: Math.ceil(style.fontSize * factor) }
    })

export const useMarkdownTheme = () => {
    const theme = useTheme()
    return useMemo(
        () =>
            deriveLineHeights({
                blockquote: {
                    borderLeftWidth: 5,
                    borderLeftColor: theme.secondary,
                    backgroundColor: theme.darken,
                    paddingLeft: 10,
                },
                heading1: {
                    fontWeight: '300',
                    fontSize: 30,
                    color: theme.important,
                    paddingTop: 20,
                    paddingBottom: 8,
                },
                heading2: {
                    fontSize: 24,
                    color: theme.important,
                    paddingTop: 16,
                    paddingBottom: 8,
                },
                heading3: {
                    fontSize: 20,
                    color: theme.important,
                    paddingTop: 16,
                    paddingBottom: 8,
                },
                heading4: {
                    fontSize: 17,
                    fontWeight: 'bold',
                    color: theme.important,
                    paddingTop: 16,
                    paddingBottom: 8,
                },
                heading5: {
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: theme.important,
                    paddingTop: 12,
                    paddingBottom: 6,
                },
                heading6: {
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: theme.important,
                    paddingTop: 12,
                    paddingBottom: 6,
                },
                hr: {
                    height: 1,
                    backgroundColor: theme.text,
                    marginVertical: 8,
                },
                code: {
                    backgroundColor: theme.notification,
                    color: 'orange',
                },
                body: {
                    color: theme.text,
                    lineHeight: 24,
                },
                strong: {
                    fontWeight: 'bold',
                    color: theme.text,
                },
                em: {
                    fontStyle: 'italic',
                    color: theme.text,
                },
                del: {
                    textDecorationLine: 'line-through',
                    color: theme.text,
                },
                u: {
                    textDecorationLine: 'underline',
                    color: theme.text,
                },
                bullet_list_icon: {
                    color: theme.important,
                },
                ordered_list_icon: {
                    color: theme.important,
                },
                link: {
                    textDecorationLine: 'underline',
                    color: theme.important,
                },
                list: {
                    paddingBottom: 20,
                },
                list_item: {
                    marginVertical: 5,
                },
                image: {
                    minWidth: 200,
                    height: 200,
                },
            }),
        [theme],
    )
}
