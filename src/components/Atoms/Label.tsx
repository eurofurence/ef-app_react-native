import { FC, useMemo } from "react";
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from "react-native";

import { Theme, useTheme } from "../../context/Theme";

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
    color?: keyof Theme;

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

export const Label: FC<LabelProps> = ({ style, type, variant, color = "text", ml, mt, mr, mb, children, ...props }) => {
    // Get theme for resolution.
    const theme = useTheme();

    // Create computed part.
    const resType = useMemo(() => (type ? types[type] : types.regular), [type]);
    const resVariant = useMemo(() => (variant ? variants[variant] : variants.regular), [variant]);
    const marginColor = useMemo(() => {
        const result: StyleProp<TextStyle> = { color: theme[color] };
        if (typeof ml === "number") result.marginLeft = ml;
        if (typeof mt === "number") result.marginTop = mt;
        if (typeof mr === "number") result.marginRight = mr;
        if (typeof mb === "number") result.marginBottom = mb;
        return result;
    }, [ml, mt, mr, mb, theme, color]);

    // Return styled text.
    return (
        <Text style={[resType, resVariant, marginColor, style]} {...props}>
            {children}
        </Text>
    );
};

const types = StyleSheet.create({
    lead: {
        fontWeight: "100",
        fontSize: 20,
    },
    h1: {
        fontWeight: "300",
        fontSize: 30,
    },
    h2: {
        fontSize: 24,
    },
    h3: {
        fontSize: 20,
    },
    h4: {
        fontSize: 17,
        fontWeight: "bold",
    },
    caption: {
        fontSize: 14,
        fontWeight: "bold",
    },
    regular: {
        fontSize: 14,
    },
    para: {
        fontSize: 14,
        lineHeight: 24,
    },
});

const variants = StyleSheet.create({
    regular: {},
    bold: { fontWeight: "bold" },
    striked: { textDecorationLine: "underline" },
    underlined: { textDecorationLine: "underline" },
});
