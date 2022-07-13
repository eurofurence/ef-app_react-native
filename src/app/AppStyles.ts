import { StyleSheet } from "react-native";

export const appStyles = StyleSheet.create({
    /**
     * Verified shadow to be used across iOS and Android devices.
     */
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
