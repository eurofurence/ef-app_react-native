import { FC, useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

/**
 * Arguments to the row.
 */
export type RowProps = ViewProps & {
    /**
     * The type, one of some predefined primary style values.
     */
    type?: keyof typeof types;

    /**
     * The variant, one of some predefined secondary style values, overriding type.
     */
    variant?: keyof typeof variants;
};

export const Row: FC<RowProps> = ({ style, type, variant, children, ...rest }) => {
    // Resolve styles.
    const resType = useMemo(() => (type ? types[type] : types.regular), [type]);
    const resVariant = useMemo(() => (variant ? variants[variant] : variants.start), [variant]);
    return (
        <View style={[resType, resVariant, style]} {...rest}>
            {children}
        </View>
    );
};

const types = StyleSheet.create({
    regular: {
        flexDirection: "row",
        alignItems: "center",
    },
    center: {
        flexDirection: "row",
        alignItems: "center",
    },
    stretch: {
        flexDirection: "row",
        alignItems: "stretch",
    },
});

const variants = StyleSheet.create({
    wrap: {
        flexWrap: "wrap",
    },
    start: {
        justifyContent: "flex-start",
    },
    end: {
        justifyContent: "flex-end",
    },
    spaced: {
        justifyContent: "space-between",
    },
    center: {
        justifyContent: "center",
    },
});
