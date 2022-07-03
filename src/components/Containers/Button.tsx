import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const Button = ({ containerStyle, style, outline, icon, children, onPress, disabled }) => {
    return (
        <TouchableOpacity disabled={disabled} containerStyle={containerStyle} style={[outline ? styles.outlineContent : styles.fillContent, style]} onPress={onPress}>
            {!icon ? null : <Ionicons style={styles.icon} name={icon} size={24} color={outline ? "black" : "white"} />}

            {!children ? null : <Text style={outline ? styles.outlineText : styles.fillText}>{children}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fillContent: {
        height: 44,
        borderRadius: 16,
        padding: 10,
        backgroundColor: "black",
        justifyContent: "center",
    },
    outlineContent: {
        borderRadius: 16,
        padding: 8,
        borderColor: "black",
        borderWidth: 2,
        justifyContent: "center",
    },
    icon: {},
    fillText: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        textAlignVertical: "center",
        color: "white",
    },
    outlineText: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        textAlignVertical: "center",
        color: "black",
    },
});
