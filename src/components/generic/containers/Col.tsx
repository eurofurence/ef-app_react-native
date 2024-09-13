import { FC } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

/**
 * Arguments to the column.
 */
export type ColProps = ViewProps & {
    /**
     * The type, one of some predefined primary style values.
     */
    type?: keyof typeof types;

    /**
     * The variant, one of some predefined secondary style values, overriding type.
     */
    variant?: keyof typeof variants;

    /**
     * If given, adds flex gap to the styles.
     */
    gap?: number;
};

export const Col: FC<ColProps> = ({ style, type, variant, gap, children, ...rest }) => {
    // Resolve styles.
    const resType = type ? types[type] : types.regular;
    const resVariant = variant ? variants[variant] : variants.start;
    return (
        <View style={[resType, resVariant, typeof gap === "number" && { gap }, style]} {...rest}>
            {children}
        </View>
    );
};

const types = StyleSheet.create({
    regular: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
    start: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    center: {
        flexDirection: "column",
        alignItems: "center",
    },
    stretch: {
        flexDirection: "column",
        alignItems: "stretch",
    },
});

const variants = StyleSheet.create({
    start: {
        justifyContent: "flex-start",
    },
    end: {
        justifyContent: "flex-end",
    },
    spaced: {
        justifyContent: "space-between",
    },
});
