import { FC, useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

export type RowProps = ViewProps & {
    type?: keyof typeof types;
    variant?: keyof typeof variants;
};

export const Row: FC<RowProps> = ({ style, type, variant, children, ...rest }) => {
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
