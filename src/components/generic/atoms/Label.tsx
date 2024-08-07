import { FC } from "react";
import { StyleSheet, Text, TextProps, ViewStyle } from "react-native";

import { Icon, IconNames } from "./Icon";
import { ThemeColor } from "../../../context/Theme";
import { useThemeColor } from "../../../hooks/themes/useThemeHooks";

/**
 * Props to label.
 */
export type LabelProps = TextProps & {
    /**
     * The type, one of some predefined primary style values.
     */
    type?: keyof typeof types;

    /**
     * The variant, one of some predefined secondary style values, overriding type.
     */
    variant?: keyof typeof variants;

    /**
     * The color name, a value from the theme.
     */
    color?: ThemeColor;

    /**
     * The icon to be displayed next to the label.
     */
    icon?: IconNames;

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
};

/**
 * A typography element.
 * @param style An extra override style.
 * @param type The type, one of some predefined primary style values.
 * @param variant The variant, one of some predefined secondary style values, overriding type.
 * @param color The color name, a value from the theme.
 * @param icon The icon to be displayed next to the label.
 * @param ml Margin left.
 * @param mt Margin top.
 * @param mr Margin right.
 * @param mb Margin bottom.
 * @param children The text content.
 * @param props Additional props passed to the root text element.
 * @constructor
 */
export const Label: FC<LabelProps> = ({ style, type, variant, color, icon, ml, mt, mr, mb, children, ...props }) => {
    // Value reads for named parameters.
    const styleType = type ? types[type] : types.regular;
    const styleVariant = variant ? variants[variant] : variants.regular;
    const styleColor = useThemeColor(color ?? "text");

    // Margin style, only created when a margin is defined.
    let styleMargin: ViewStyle | null = null;
    if (typeof ml === "number" || typeof mt === "number" || typeof mr === "number" || typeof mb === "number") {
        styleMargin = {};
        if (typeof ml === "number") styleMargin.marginLeft = ml;
        if (typeof mt === "number") styleMargin.marginTop = mt;
        if (typeof mr === "number") styleMargin.marginRight = mr;
        if (typeof mb === "number") styleMargin.marginBottom = mb;
    }

    // Return styled text.
    return (
        <Text style={[styleType, styleVariant, styleMargin, styleColor, style]} {...props}>
            {!icon ? null : <Icon name={icon} style={styles.icon} size={styleType.fontSize * 2} />}
            {children}
        </Text>
    );
};

/**
 * Fixed component styles.
 */
const styles = StyleSheet.create({
    icon: { marginRight: 8, textAlignVertical: "bottom" },
});

/**
 * Label font settings.
 */
const types = StyleSheet.create({
    lead: {
        fontSize: 20,
        lineHeight: 20,
        fontWeight: "100",
    },
    h1: {
        fontSize: 30,
        lineHeight: 34,
        fontWeight: "300",
    },
    h2: {
        fontSize: 24,
        lineHeight: 28,
        fontWeight: "normal",
    },
    h3: {
        fontSize: 20,
        lineHeight: 24,
        fontWeight: "normal",
    },
    h4: {
        fontSize: 17,
        lineHeight: 21,
        fontWeight: "600",
    },
    h5: {
        fontSize: 15,
        lineHeight: 19,
        fontWeight: "600",
    },
    h6: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "600",
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: "600",
        opacity: 0.666,
    },
    compact: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: "normal",
    },
    regular: {
        fontSize: 14,
        fontWeight: "normal",
    },
    minor: {
        fontSize: 10,
        fontWeight: "normal",
    },
    strong: {
        fontSize: 14,
        fontWeight: "900",
    },
    para: {
        fontSize: 14,
        fontWeight: "normal",
        lineHeight: 24,
    },
    del: {
        fontSize: 14,
        fontWeight: "normal",
        textDecorationLine: "line-through",
    },
    em: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "italic",
    },
    u: {
        fontSize: 14,
        fontWeight: "normal",
        textDecorationLine: "underline",
    },
    cap: {
        fontSize: 10,
        lineHeight: 10,
        fontWeight: "bold",
    },
});

/**
 * Label variant definitions.
 */
const variants = StyleSheet.create({
    regular: {},
    narrow: {
        fontWeight: "300",
    },
    bold: {
        fontWeight: "900",
    },
    striked: {
        textDecorationLine: "underline",
    },
    underlined: {
        textDecorationLine: "underline",
    },
    middle: {
        textAlign: "center",
        textAlignVertical: "center",
    },
    shadow: {
        textShadowColor: "#000000",
        textShadowRadius: 2,
        textShadowOffset: { width: 0.5, height: 1 },
    },
});
