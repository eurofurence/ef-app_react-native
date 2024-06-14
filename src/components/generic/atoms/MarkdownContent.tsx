import { FC, useMemo } from "react";
import { View, ViewStyle } from "react-native";
import Markdown, { MarkdownProps } from "react-native-markdown-display";

import { LabelProps } from "./Label";
import { useAppSelector } from "../../../store";
import { selectMarkdownTheme } from "../../../store/settings.selectors";

const MarkdownComponent: FC<MarkdownProps & { children?: string }> = Markdown as any;

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
    let styleMargin: ViewStyle | null = null;
    if (typeof ml === "number" || typeof mt === "number" || typeof mr === "number" || typeof mb === "number") {
        styleMargin = {};
        if (typeof ml === "number") styleMargin.marginLeft = ml;
        if (typeof mt === "number") styleMargin.paddingTop = mt;
        if (typeof mr === "number") styleMargin.marginRight = mr;
        if (typeof mb === "number") styleMargin.paddingBottom = mb;
    }

    // Get markdown style.
    const markdownStyles = useAppSelector(selectMarkdownTheme);

    return (
        <View style={styleMargin}>
            <MarkdownComponent style={markdownStyles as any}>{fixed}</MarkdownComponent>
        </View>
    );
};
