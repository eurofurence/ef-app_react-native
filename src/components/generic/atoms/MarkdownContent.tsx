import { FC, useMemo } from 'react'
import { View, ViewStyle } from 'react-native'
import Markdown, { MarkdownProps } from 'react-native-markdown-display'
import { LabelProps } from './Label'
import { useMarkdownTheme } from '@/store/settings/selectors'

const MarkdownComponent: FC<MarkdownProps & { children?: string }> = Markdown as any

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
const links = /(]\(|\[)?https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*/gi

export type MarkdownContentProps = {
    defaultType?: LabelProps['type'];

    style?: ViewStyle;

    children?: string;
};

export const MarkdownContent: FC<MarkdownContentProps> = ({ style, children }) => {
    const fixed = useMemo(
        () =>
            children
                ?.replace(newline, '\n')
                ?.replace(paraspace, ' ')
                ?.replace(links, (s, args) => {
                    if (args?.[0]) return s
                    else return `[${s}](${s})`
                }),
        [children],
    )

    // Get markdown style.
    const markdownStyles = useMarkdownTheme()

    return (
        <View style={style}>
            <MarkdownComponent style={markdownStyles as any}>{fixed}</MarkdownComponent>
        </View>
    )
}
