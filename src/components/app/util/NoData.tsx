import { StyleSheet, View } from "react-native";

import Icon from "../../generic/atoms/Icon";
import { Label } from "../../generic/atoms/Label";

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
