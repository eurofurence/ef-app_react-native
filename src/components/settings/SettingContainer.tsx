import { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

/**
 * Provides vertical spacing via margin around the children.
 */
export const SettingContainer: FC<PropsWithChildren> = ({ children }) => (
    <View style={styles.margin}>{children}</View>
);

const styles = StyleSheet.create({
    margin: {
        marginVertical: 20,
    },
}); 