import { FC, ReactElement, useMemo } from "react";
import { RefreshControlProps, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export const scrollerPadding = {
    horizontal: 30,
    bottom: 100,
};

/**
 * Props to the scroller.
 */
export type ScrollerProps = {
    /**
     * The width to limit the content to.
     */
    limitWidth?: number;

    refreshControl?: ReactElement<RefreshControlProps>;
};

/**
 * A scrolling content with a child that has a maximum width.
 * @constructor
 */
export const Scroller: FC<ScrollerProps> = ({ limitWidth = 600, refreshControl, children }) => {
    const limitStyle = useMemo<ViewStyle>(() => ({ maxWidth: limitWidth }), [limitWidth]);
    return (
        <ScrollView style={styles.scroller} contentContainerStyle={styles.container} refreshControl={refreshControl}>
            <View style={styles.arranger}>
                <View style={[styles.content, limitStyle]}>{children}</View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroller: {
        flex: 1,
    },
    container: {
        paddingHorizontal: scrollerPadding.horizontal,
        paddingBottom: scrollerPadding.bottom,
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
