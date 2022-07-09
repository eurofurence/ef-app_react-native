import { FC, useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

export type ColProps = ViewProps & {
    type?: keyof typeof types;
    variant?: keyof typeof variants;
};

export const Col: FC<ColProps> = ({ style, type, variant, children, ...rest }) => {
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
        flexDirection: "column",
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
