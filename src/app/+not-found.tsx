import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Label } from "@/components/generic/atoms/Label";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View style={styles.container}>
                <Label type={"h1"}>This screen doesn&apos;t exist.</Label>
                <Link href="/" style={styles.link}>
                    <Label type={"underlined"}>Go to home screen!</Label>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
