import React, { FC, ReactNode, useMemo } from "react";
import { Image, ImageSourcePropType, Platform, StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Label } from "../../components/Atoms/Label";
import { useTheme } from "../../context/Theme";
import { appStyles } from "../AppStyles";

export type EventCardProps = {
    background?: ImageSourcePropType;
    pre: ReactNode;
    title?: string;
    subtitle?: string;
    tag?: string;
    happening: boolean;
    done: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
};

export const EventCardContent: FC<EventCardProps> = ({ background, pre, title, subtitle, tag, happening, done, onPress, onLongPress }) => {
    // TODO: Indicate if happening at the moment.

    const theme = useTheme();
    const blurRadius = Platform.OS === "android" ? 3 : 8;
    const backgroundStyle = useMemo<ViewStyle>(() => ({ backgroundColor: theme.surface }), [theme]);
    const preBackgroundStyle = useMemo<ViewStyle>(() => ({ backgroundColor: done ? theme.darken : theme.primary }), [done, theme]);

    return (
        <TouchableOpacity containerStyle={styles.container} style={[appStyles.shadow, styles.content, backgroundStyle]} onPress={onPress} onLongPress={onLongPress}>
            {!background ? null : <Image style={styles.background} resizeMode="cover" blurRadius={blurRadius} source={background} />}

            {!pre ? null : (
                <View style={[styles.pre, preBackgroundStyle]}>
                    <View>
                        <Label style={{ color: done ? theme.important : theme.invText }} type="h2">
                            {pre}
                        </Label>
                    </View>
                </View>
            )}
            <View style={styles.main}>
                {!title ? null : (
                    <Label style={styles.title} type="h2">
                        {title}
                    </Label>
                )}

                <View style={styles.subtitleArea}>
                    {!subtitle ? null : (
                        <Label style={styles.subtitle} type="caption" ellipsizeMode="tail" numberOfLines={2}>
                            {subtitle}
                        </Label>
                    )}

                    {!tag ? null : (
                        <Label style={styles.tag} type="caption" ellipsizeMode="tail" numberOfLines={2}>
                            {tag}
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
    },
    content: {
        borderRadius: 16,
        overflow: "hidden",
        flexDirection: "row",
    },
    pre: {
        overflow: "hidden",
        flexBasis: 70,
        alignItems: "center",
        justifyContent: "center",
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
    indicator: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 16,
    },
});
