import React, { FC, ReactNode, useMemo } from "react";
import { Image, ImageSourcePropType, Platform, StyleSheet, View, ViewStyle, TouchableOpacity } from "react-native";

import { Indicator } from "../../components/Atoms/Indicator";
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
        <TouchableOpacity style={[styles.container, appStyles.shadow, styles.content, backgroundStyle]} onPress={onPress} onLongPress={onLongPress}>
            {!background ? null : <Image style={styles.background} resizeMode="cover" blurRadius={blurRadius} source={background} />}

            {!pre ? null : <View style={[styles.pre, preBackgroundStyle]}>{pre}</View>}

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

            {!happening ? null : (
                <View style={styles.indicator}>
                    <Indicator color={done ? theme.important : theme.invText} />
                </View>
            )}
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
        left: 0,
        padding: 14,
    },
});
