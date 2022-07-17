import React, { useMemo, FC } from "react";
import { Image, ImageSourcePropType, Platform, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { useTheme } from "../../context/Theme";
import { appStyles } from "../AppStyles";

export type DealerCardContentProps = {
    avatar?: ImageSourcePropType;
    preview?: ImageSourcePropType;
    name: string;
    merchandise?: string;
    days?: string;
    onPress?: () => void;
    onLongPress?: () => void;
};

export const DealerCardContent: FC<DealerCardContentProps> = ({ avatar, preview, name, merchandise, days, onPress, onLongPress }) => {
    const theme = useTheme();
    const blurRadius = Platform.OS === "android" ? 3 : 8;
    const backgroundStyle = useMemo<ViewStyle>(() => ({ backgroundColor: theme.background }), [theme]);

    return (
        <TouchableOpacity style={[styles.container, appStyles.shadow, backgroundStyle]} onPress={onPress} onLongPress={onLongPress}>
            {!preview ? null : <Image style={styles.background} resizeMode="cover" blurRadius={blurRadius} source={preview} />}

            {!avatar ? null : (
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatarCircle, appStyles.shadow]}>
                        <Image style={styles.avatarImage} source={avatar} resizeMode="cover" />
                    </View>
                </View>
            )}

            <View style={styles.main}>
                <Label style={styles.title} type="h2">
                    {name}
                </Label>

                <View style={styles.subtitleArea}>
                    {!merchandise ? null : (
                        <Label style={styles.subtitle} type="caption" ellipsizeMode="tail" numberOfLines={2}>
                            {merchandise}
                        </Label>
                    )}

                    {!days ? null : (
                        <Label style={styles.tag} type="caption" ellipsizeMode="tail" numberOfLines={2}>
                            {days}
                        </Label>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 80,
        marginVertical: 15,
        borderRadius: 16,
        overflow: "hidden",
        flexDirection: "row",
    },
    background: {
        position: "absolute",
        width: undefined,
        height: undefined,
        left: -10,
        top: -10,
        right: -10,
        bottom: -10,
        opacity: 0.2,
    },
    avatarContainer: {
        paddingLeft: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: "hidden",
    },
    avatarImage: {
        flex: 1,
        alignSelf: "stretch",
    },
    image: {
        position: "absolute",
        width: undefined,
        height: undefined,
        left: -10,
        top: -10,
        right: -10,
        bottom: -10,
    },
    imageOverlay: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    main: {
        flex: 1,
        padding: 16,
    },
    head: {},
    title: {},
    subtitleArea: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    subtitle: {
        flex: 1,
        flexShrink: 1,
    },
    tag: {
        flexShrink: 5,
        flex: 1,
        fontWeight: "600",
        textAlign: "right",
    },
});
