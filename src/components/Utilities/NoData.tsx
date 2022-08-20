import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, View } from "react-native";

import { Label } from "../Atoms/Label";

export const NoData = () => {
    return (
        <View style={[styles.container]}>
            <Icon name={"calendar-alert"} size={40} style={{ marginBottom: 20 }} />
            <Label type={"h3"} variant={"narrow"}>
                There's nothing here yet . . .
            </Label>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxHeight: "100%",
        height: 400,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
});
