import { mapValues } from 'lodash'
import { type FC, useMemo } from 'react'
import { View, type ViewStyle } from 'react-native'
import Markdown, { type MarkdownProps } from 'react-native-markdown-display'

import { useTheme } from '@/hooks/themes/useThemeHooks'

import type { LabelProps } from './Label'

/**
 * Assigns line heights by factor for styles that have font size but no line height.
 * @param styles The styles to map.
 * @param factor The factor to apply.
 */
const deriveLineHeights = <
  T extends {
    fontSize?: number
    lineHeight?: number
  },
>(
  styles: Record<string, T>,
  factor = 1.25
) =>
  mapValues(styles, (style) => {
    if (style.fontSize === undefined || style.lineHeight !== undefined)
      return style
    return { ...style, lineHeight: Math.ceil(style.fontSize * factor) }
  })

const useMarkdownTheme = () => {
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
          fontSize: 24,
          color: theme.important,
          paddingTop: 20,
          paddingBottom: 8,
        },
        heading2: {
          fontSize: 20,
          color: theme.important,
          paddingTop: 16,
          paddingBottom: 8,
        },
        heading3: {
          fontSize: 18,
          color: theme.important,
          paddingTop: 16,
          paddingBottom: 8,
        },
        heading4: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.important,
          paddingTop: 16,
          paddingBottom: 8,
        },
        heading5: {
          fontSize: 14,
          fontWeight: 'bold',
          color: theme.important,
          paddingTop: 12,
          paddingBottom: 6,
        },
        heading6: {
          fontSize: 14,
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
        text: {
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
    [theme]
  )
}

const MarkdownComponent: FC<MarkdownProps & { children?: string }> =
  Markdown as any

/**
 * Matches newlines with carriage return or carriage return and newline, for normalization.
 */
const newline = /\r\n?/gm

/**
 * Matches sections that should be paragraph spaced.
 */
const paraspace = /(?<!\s)\n(?!\n|\s*\*|\s*-|\s*\+|\s*\d|#)/gm

/**
 * Matches links, checking if they were not in a markdown link segment.
 */
const links =
  /(]\(|\[)?https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*/gi

export type MarkdownContentProps = {
  defaultType?: LabelProps['type']

  style?: ViewStyle

  children?: string
}

export const MarkdownContent: FC<MarkdownContentProps> = ({
  style,
  children,
}) => {
  const fixed = useMemo(
    () =>
      children
        ?.replace(newline, '\n')
        ?.replace(paraspace, ' ')
        ?.replace(links, (s, args) => {
          if (args?.[0]) return s
          else return `[${s}](${s})`
        }),
    [children]
  )

  // Get markdown style.
  const markdownStyles = useMarkdownTheme()

  return (
    <View style={style}>
      <MarkdownComponent style={markdownStyles as any}>
        {fixed}
      </MarkdownComponent>
    </View>
  )
}
