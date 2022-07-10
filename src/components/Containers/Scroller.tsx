import { FC, useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

/**
 * Props to the scroller.
 */
export type ScrollerProps = {
    /**
     * The width to limit the content to.
     */
    limitWidth?: number;
};

/**
 * A scrolling content with a child that has a maximum width.
 * @constructor
 */
export const Scroller: FC<ScrollerProps> = ({ limitWidth = 600, children }) => {
    const limitStyle = useMemo<ViewStyle>(() => ({ maxWidth: limitWidth }), [limitWidth]);
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.arranger}>
                <View style={[styles.content, limitStyle]}>{children}</View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingBottom: 100,
    },
    arranger: {
        flexDirection: "row",
        justifyContent: "center",
    },
    content: {
        flex: 1,
        alignSelf: "center",
    },
});
