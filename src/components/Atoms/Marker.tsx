import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FC, useMemo } from "react";
import * as React from "react";
import { ColorValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Theme, useTheme } from "../../context/Theme";
import { IconNames } from "../../types/IconNames";

export type MarkerProps = {
    style?: StyleProp<ViewStyle>;
    markerColor?: keyof Theme | ColorValue;
    markerType?: IconNames;
    markerSize?: number;
};

export const Marker: FC<MarkerProps> = ({ style, markerColor = "primary", markerType = "map-marker", markerSize = 40 }) => {
    const theme = useTheme();
    const color = useMemo(() => (typeof markerColor === "string" && markerColor in theme ? theme[markerColor] : markerColor), [theme, markerColor]);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.content}>
                <Icon name={markerType} color={color} size={markerSize} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: 0,
        height: 0,
        alignItems: "center",
    },
    content: {
        position: "absolute",
        bottom: 0,
    },
});
