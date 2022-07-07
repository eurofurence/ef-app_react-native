import { StyleSheet, View } from "react-native";

export const Measure = () => (
    <View style={StyleSheet.absoluteFill}>
        <View style={styles.topLeft} />
        <View style={styles.topRight} />
        <View style={styles.bottomLeft} />
        <View style={styles.bottomRight} />
    </View>
);

const styles = StyleSheet.create({
    topLeft: {
        position: "absolute",
        width: 30,
        height: 30,
        top: 0,
        left: 0,
        backgroundColor: "black",
    },
    topRight: {
        position: "absolute",
        width: 30,
        height: 30,
        top: 0,
        right: 0,
        backgroundColor: "black",
    },
    bottomLeft: {
        position: "absolute",
        width: 30,
        height: 30,
        bottom: 0,
        left: 0,
        backgroundColor: "black",
    },
    bottomRight: {
        position: "absolute",
        width: 30,
        height: 30,
        bottom: 0,
        right: 0,
        backgroundColor: "black",
    },
});
