import { FC, useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

/**
 * Props to the Floater.
 */
export type FloaterProps = {
    /**
     * The width to limit the content to.
     */
    limitWidth?: number;
};

/**
 * A scrolling content with a child that has a maximum width.
 * @constructor
 */
export const Floater: FC<FloaterProps> = ({ limitWidth = 600, children }) => {
    const limitStyle = useMemo<ViewStyle>(() => ({ maxWidth: limitWidth }), [limitWidth]);
    return (
        <View style={styles.container}>
            <View style={styles.arranger}>
                <View style={[styles.content, limitStyle]}>{children}</View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
    },
    arranger: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
    },
    content: {
        flex: 1,
        alignSelf: "stretch",
    },
});
