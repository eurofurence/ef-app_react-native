import Ionicons from "@expo/vector-icons/Ionicons";
import { FC, useMemo } from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useTheme } from "../../context/Theme";
import { IoniconsNames } from "../../types/Ionicons";
import { Label } from "../Atoms/Label";

const iconSize = 20;

/**
 * Arguments to the page.
 */
export type PageProps = {
    /**
     * The icon of the page.
     */
    icon?: IoniconsNames;

    /**
     * The caption of the page.
     */
    text?: string;

    /**
     * True if to be rendered as active.
     */
    active?: boolean;

    /**
     * True if this page should be highlighted.
     */
    highlight?: boolean;

    /**
     * If given, invoked when the tab is pressed.
     */
    onPress?: () => void;

    /**
     * Called on layout.
     */
    onLayout?: ViewProps["onLayout"];
};

/**
 * Page is an icon or caption view intended for use in the top-navigation control.
 * @constructor
 */
export const Page: FC<PageProps> = ({ icon, text, active = false, highlight = false, onPress, onLayout }) => {
    const theme = useTheme();

    // The color to use for icon or text, i.e., foreground.
    const colorContent = useMemo(() => (highlight ? (active ? theme.invImportant : theme.invText) : active ? theme.secondary : theme.text), [theme, active, highlight]);

    // The style of the container and the item.
    const styleContainer = useMemo<ViewStyle>(() => (icon ? styles.containerStatic : styles.containerGrow), [icon]);
    const styleItem = useMemo<ViewStyle>(() => ({ backgroundColor: highlight ? theme.secondary : undefined }), [theme, highlight]);

    return (
        <View style={styleContainer} onLayout={onLayout}>
            <TouchableOpacity containerStyle={styleContainer} style={styles.page} onPress={onPress}>
                {icon ? (
                    <View style={[styles.item, styleItem]}>
                        <Ionicons name={icon} size={iconSize} color={colorContent} />
                    </View>
                ) : (
                    <View style={[styles.item, styleItem]}>
                        <Label style={styles.text} color={colorContent}>
                            {text ?? " "}
                        </Label>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    containerStatic: {
        flexDirection: "row",
        alignItems: "stretch",
    },
    containerGrow: {
        flexDirection: "row",
        alignItems: "stretch",
        flexGrow: 1,
    },
    page: {
        alignItems: "center",
        paddingHorizontal: 4,
        paddingVertical: 8,
        flex: 1,
    },
    border: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    item: {
        alignSelf: "stretch",
        alignItems: "center",
        height: iconSize + 12,
        justifyContent: "center",
        padding: 4,
        borderRadius: 8,
    },
    text: {
        fontWeight: "bold",
    },
});
