import { FC, PropsWithChildren, useMemo } from "react";
import { StyleProp, TextStyle } from "react-native";
// @ts-expect-error untyped module
import Markdown from "react-native-easy-markdown";

import { LabelProps } from "./Label";
import { useTheme } from "../../context/Theme";

export type MarkdownContentProps = PropsWithChildren<{
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
}>;

export const MarkdownContent: FC<MarkdownContentProps> = ({ ml, mt, mr, mb, children }) => {
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
        () => ({
            block: {
                paddingBottom: 10,
                flexWrap: "wrap",
                flexDirection: "row",
            },
            blockQuote: {
                borderLeftWidth: 5,
                borderLeftColor: theme.secondary,
                backgroundColor: theme.darken,
                paddingLeft: 10,
            },
            h1: {
                fontWeight: "300",
                fontSize: 30,
                color: theme.important,
                paddingTop: 20,
                paddingBottom: 8,
            },
            h2: {
                fontSize: 24,
                color: theme.important,
                paddingTop: 16,
                paddingBottom: 8,
            },
            h3: {
                fontSize: 20,
                color: theme.important,
                paddingTop: 16,
                paddingBottom: 8,
            },
            h4: {
                fontSize: 17,
                fontWeight: "bold",
                color: theme.important,
                paddingTop: 16,
                paddingBottom: 8,
            },
            h5: {
                fontSize: 15,
                fontWeight: "bold",
                color: theme.important,
                paddingTop: 12,
                paddingBottom: 6,
            },
            h6: {
                fontSize: 15,
                fontWeight: "bold",
                color: theme.important,
                paddingTop: 12,
                paddingBottom: 6,
            },
            hr: {
                alignSelf: "stretch",
                height: 1,
                backgroundColor: theme.text,
                marginVertical: 8,
            },
            code: {
                backgroundColor: theme.notification,
                color: "orange",
            },
            text: {
                alignSelf: "flex-start",
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
            linkWrapper: {
                alignSelf: "flex-start",
            },
            link: {
                textDecorationLine: "underline",
                alignSelf: "flex-start",
                color: theme.important,
            },
            list: {
                paddingBottom: 20,
            },
            listItem: {
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginVertical: 5,
            },
            listItemContent: {
                flexDirection: "row",
                flexShrink: 1,
                justifyContent: "flex-start",
                alignItems: "flex-start",
            },
            listItemBullet: {
                width: 4,
                height: 4,
                backgroundColor: theme.important,
                borderRadius: 2,
                marginRight: 10,
            },
            listItemNumber: {
                marginRight: 10,
            },
            imageWrapper: {
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-start",
            },
            image: {
                flex: 1,
                minWidth: 200,
                height: 200,
            },
        }),
        [theme],
    );

    return (
        <Markdown style={styleContainer} markdownStyles={markdownStyles}>
            {children}
        </Markdown>
    );
};
