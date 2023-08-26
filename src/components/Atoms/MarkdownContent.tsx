import { mapValues } from "lodash";
import { FC, useMemo } from "react";
import { StyleProp, TextStyle, View } from "react-native";
import Markdown, { MarkdownProps } from "react-native-markdown-display";

import { LabelProps } from "./Label";
import { useTheme } from "../../context/Theme";

const MarkdownComponent: FC<MarkdownProps & { children?: string }> = Markdown as any;

/**
 * Assigns line heights by factor for styles that have font size but no line height.
 * @param styles The styles to map.
 * @param factor The factor to apply.
 */
const deriveLineHeights = <T extends { fontSize?: number; lineHeight?: number }>(styles: Record<string, T>, factor = 1.25) =>
    mapValues(styles, (style) => {
        if (style.fontSize === undefined || style.lineHeight !== undefined) return style;
        else
            return {
                ...style,
                lineHeight: Math.ceil(style.fontSize * factor),
            };
    });

export type MarkdownContentProps = {
    defaultType?: LabelProps["type"];

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
    const fixed = useMemo(() => children?.replace(/\r\n?/gm, "\n")?.replace(/(?<!\s)\n(?!\n|\s*\*|\s*-|\s*\+|\s*\d|#)/gm, " "), [children]);

    // Compute outer container margins.
    const styleContainer = useMemo<StyleProp<TextStyle>>(() => {
        const result: StyleProp<TextStyle> = {};
        if (typeof ml === "number") result.marginLeft = ml;
        if (typeof mt === "number") result.paddingTop = mt;
        if (typeof mr === "number") result.marginRight = mr;
        if (typeof mb === "number") result.paddingBottom = mb;
        return result;
    }, [ml, mt, mr, mb]);

    // Compute markdown styles.
    const theme = useTheme();
    const markdownStyles = useMemo(
        () =>
            deriveLineHeights({
                blockquote: {
                    borderLeftWidth: 5,
                    borderLeftColor: theme.secondary,
                    backgroundColor: theme.darken,
                    paddingLeft: 10,
                },
                heading1: {
                    fontWeight: "300",
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
                    fontWeight: "bold",
                    color: theme.important,
                    paddingTop: 16,
                    paddingBottom: 8,
                },
                heading5: {
                    fontSize: 15,
                    fontWeight: "bold",
                    color: theme.important,
                    paddingTop: 12,
                    paddingBottom: 6,
                },
                heading6: {
                    fontSize: 15,
                    fontWeight: "bold",
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
                    color: "orange",
                },
                body: {
                    color: theme.text,
                    lineHeight: 24,
                },
                strong: {
                    fontWeight: "bold",
                    color: theme.text,
                },
                em: {
                    fontStyle: "italic",
                    color: theme.text,
                },
                del: {
                    textDecorationLine: "line-through",
                    color: theme.text,
                },
                u: {
                    textDecorationLine: "underline",
                    color: theme.text,
                },
                bullet_list_icon: {
                    color: theme.important,
                },
                ordered_list_icon: {
                    color: theme.important,
                },
                link: {
                    textDecorationLine: "underline",
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
    );

    return (
        <View style={styleContainer}>
            <MarkdownComponent style={markdownStyles as any}>{fixed}</MarkdownComponent>
        </View>
    );
};
