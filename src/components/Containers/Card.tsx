import { FC, PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { appStyles } from "../../app/AppStyles";
import { useTheme } from "../../context/Theme";

type CardProps = PropsWithChildren<{
    onPress?: () => void;
    onLongPress?: () => void;
    style?: StyleProp<ViewStyle> | undefined;
}>;

export const Card: FC<CardProps> = ({ children, onPress, onLongPress, style }) => {
    const theme = useTheme();
    return (
        <TouchableOpacity
            style={[styles.container, appStyles.shadow, { backgroundColor: theme.background }, style]}
            onPress={onPress}
            onLongPress={onLongPress}
            disabled={onPress === undefined && onLongPress === undefined}
        >
            <View style={styles.main}>{children}</View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 80,
        marginVertical: 15,
        borderRadius: 16,
        overflow: "hidden",
        flexDirection: "row",
    },
    main: {
        flex: 1,
        padding: 16,
    },
});
