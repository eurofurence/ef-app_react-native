import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/core";
import { FC, useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useTheme } from "../../context/Theme";
import { Activity } from "../Atoms/Activity";
import { Label } from "../Atoms/Label";
import { Row } from "./Row";

const iconSize = 32;

export type HeaderProps = ViewProps;

export const Header: FC<HeaderProps> = ({ style, children }) => {
    const theme = useTheme();

    const borderColor = useMemo(() => ({ borderColor: theme.darken }), [theme]);

    const navigation = useNavigation();

    return (
        <Row style={[styles.container, borderColor, style]} type="center" variant="spaced">
            <Ionicons name="chevron-back" size={iconSize} />

            <Label type="lead" ellipsizeMode="tail" numberOfLines={1}>
                {children}
            </Label>

            <View style={styles.placeholder} />

            <TouchableOpacity containerStyle={styles.back} onPress={() => navigation.goBack()} />

            <Activity style={styles.activity} />
        </Row>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingTop: 30,
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    placeholder: {
        width: iconSize,
        height: iconSize,
    },
    back: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "30%",
    },
    activity: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
    },
});
