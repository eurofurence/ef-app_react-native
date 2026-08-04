import { captureException } from '@sentry/react-native'
import { mapValues } from 'lodash'
import { type FC, useMemo } from 'react'
import { Linking, View, type ViewStyle } from 'react-native'
import {
  EnrichedMarkdownText,
  type MarkdownStyle,
} from 'react-native-enriched-markdown'
import { withAlpha } from '@/context/Theme'
import { useTheme, useThemeColorValue } from '@/hooks/themes/useThemeHooks'
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

function useMarkdownTheme() {
  const theme = useTheme()
  return useMemo(
    () =>
      deriveLineHeights({
        blockquote: {
          borderWidth: 5,
          borderColor: theme.secondary,
          backgroundColor: theme.darken,
          gapWidth: 10,
          color: theme.text,
        },
        h1: {
          fontWeight: '300',
          fontSize: 24,
          color: theme.important,
          marginTop: 20,
          marginBottom: 8,
        },
        h2: {
          fontSize: 20,
          color: theme.important,
          marginTop: 16,
          marginBottom: 8,
        },
        h3: {
          fontSize: 18,
          color: theme.important,
          marginTop: 16,
          marginBottom: 8,
        },
        h4: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.important,
          marginTop: 16,
          marginBottom: 8,
        },
        h5: {
          fontSize: 14,
          fontWeight: 'bold',
          color: theme.important,
          marginTop: 12,
          marginBottom: 6,
        },
        h6: {
          fontSize: 14,
          fontWeight: 'bold',
          color: theme.important,
          marginTop: 12,
          marginBottom: 6,
        },
        thematicBreak: {
          height: 1,
          color: theme.text,
          marginTop: 8,
          marginBottom: 8,
        },
        code: {
          backgroundColor: theme.notification,
          color: 'orange',
        },
        codeBlock: {
          backgroundColor: theme.notification,
          color: 'orange',
        },
        paragraph: {
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
        strikethrough: {
          color: theme.text,
        },
        underline: {
          color: theme.text,
        },
        link: {
          underline: true,
          color: theme.important,
        },
        list: {
          color: theme.text,
          lineHeight: 24,
          bulletColor: theme.important,
          markerColor: theme.important,
          marginBottom: 20,
        },
        image: {
          height: 200,
        },
      }) as MarkdownStyle,
    [theme]
  )
}

/**
 * Matches newlines with carriage return or carriage return and newline, for normalization.
 */
const newline = /\r\n?/gm

/**
 * Matches sections that should be paragraph spaced.
 */
const paraspace = /^(?![ \t]*#)(.*\S)\n(?!\n|\s*\*|\s*-|\s*\+|\s*\d|#)/gm

/**
 * Matches links, checking if they were not in a markdown link segment.
 */
const links =
  /(]\(|\[)?https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*/gi

/**
 * Amounts are common in this content, so LaTeX must not claim them.
 */
const md4cFlags = { latexMath: false }

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
        ?.replace(paraspace, '$1 ')
        ?.replace(links, (s, args) => {
          if (args?.[0]) return s
          else return `[${s}](${s})`
        }) ?? '',
    [children]
  )

  const markdownTheme = useMarkdownTheme()
  const primary = useThemeColorValue('primary')

  return (
    <View style={style}>
      <EnrichedMarkdownText
        markdown={fixed}
        markdownStyle={markdownTheme}
        md4cFlags={md4cFlags}
        selectable
        selectionColor={withAlpha(primary, 0.35)}
        onLinkPress={({ url }) => {
          Linking.openURL(url).catch(captureException)
        }}
      />
    </View>
  )
}
