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

    /**
     * Margin left.
     */
    ml?: number;

    /**
     * Margin top.
     */
    mt?: number;

    /**
     * Margin right.
     */
    mr?: number;

    /**
     * Margin bottom.
     */
    mb?: number;

    children?: string;
};

export const MarkdownContent: FC<MarkdownContentProps> = ({ ml, mt, mr, mb, children }) => {
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

    // Compute outer container margins.
    let styleMargin: ViewStyle | null = null
    if (typeof ml === 'number' || typeof mt === 'number' || typeof mr === 'number' || typeof mb === 'number') {
        styleMargin = {}
        if (typeof ml === 'number') styleMargin.marginLeft = ml
        if (typeof mt === 'number') styleMargin.paddingTop = mt
        if (typeof mr === 'number') styleMargin.marginRight = mr
        if (typeof mb === 'number') styleMargin.paddingBottom = mb
    }

    // Get markdown style.
    const markdownStyles = useMarkdownTheme()

    return (
        <View style={styleMargin}>
            <MarkdownComponent style={markdownStyles as any}>{fixed}</MarkdownComponent>
        </View>
    )
}
