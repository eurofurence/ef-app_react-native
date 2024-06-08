import { Image } from "expo-image";
import { View, StyleSheet } from "react-native";

import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { Continuous } from "../generic/atoms/Continuous";
import { Label } from "../generic/atoms/Label";

const logoSrc = require("../../../assets/images/banner_2023_logo.png");
export const GettingThingsReady = () => {
    const background = useThemeBackground("primary");
    return (
        <View style={[StyleSheet.absoluteFill, styles.center, background]}>
            <View style={[styles.center, styles.extraMargin]}>
                <Image style={styles.logo} source={logoSrc} contentFit="contain" />
                <Label mt={15} mb={20} type="h1" color="invText">
                    Getting things ready
                </Label>
                <Continuous active color="invText" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: "50%",
        height: "auto",
        maxWidth: 200,
        aspectRatio: 1,
        alignSelf: "center",
    },
    extraMargin: {
        marginBottom: "15%",
    },
});
