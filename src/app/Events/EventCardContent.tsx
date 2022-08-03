import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React, { FC, memo, ReactNode, useMemo } from "react";
import { Image, ImageSourcePropType, StyleSheet, View, ViewStyle, TouchableOpacity, ColorValue } from "react-native";

import { Indicator } from "../../components/Atoms/Indicator";
import { Label } from "../../components/Atoms/Label";
import { useTheme } from "../../context/Theme";
import { IconNames } from "../../types/IconNames";
import { appStyles } from "../AppStyles";

const glyphIconSize = 90;
const badgeIconSize = 20;

export type EventCardProps = {
    badges?: IconNames[];
    glyph?: IconNames;
    pre: ReactNode;
    poster?: ImageSourcePropType;
    title?: string;
    subtitle?: string;
    tag?: string;
    happening: boolean;
    done: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
};

export const EventCardContent: FC<EventCardProps> = memo(({ badges, glyph, pre, poster, title, subtitle, tag, happening, done, onPress, onLongPress }) => {
    const theme = useTheme();
    const styleContainer = useMemo<ViewStyle>(() => ({ backgroundColor: theme.background }), [theme]);
    const stylePre = useMemo<ViewStyle>(() => ({ backgroundColor: done ? theme.darken : theme.primary }), [done, theme]);
    const styleBadgeFrame = useMemo<ViewStyle>(() => ({ backgroundColor : theme.secondary }),  [theme]);
    const colorBadge = useMemo<ColorValue>(() => (theme.white),  [theme]);
    const colorGlyph = useMemo<ColorValue>(() => (done ? theme.darken : theme.white), [done, theme]);
    return (
        <TouchableOpacity style={[styles.container, appStyles.shadow, styleContainer]} onPress={onPress} onLongPress={onLongPress}>
            <View style={[styles.pre, stylePre]}>
                {!glyph ? null : (
                    <View style={styles.glyphContainer}>
                        <Icon style={styles.glyph} name={glyph} size={glyphIconSize} color={colorGlyph} />
                    </View>
                )}
                {pre}
            </View>

            {poster ? (
                <View style={styles.mainPoster}>
                    <Image style={StyleSheet.absoluteFill} resizeMode="cover" source={poster} />
                    <View style={styles.tagArea}>
                        <Label style={styles.tag} type="regular" color="white" ellipsizeMode="head" numberOfLines={1}>
                            {title} {subtitle}
                        </Label>
                        <Label style={styles.tag} type="regular" color="white" ellipsizeMode="head" numberOfLines={1}>
                            {tag}
                        </Label>
                    </View>
                </View>
            ) : (
                <View style={styles.mainText}>
                    <Label type="h3">{title}</Label>
                    <Label type="h4" variant="narrow">
                        {subtitle}
                    </Label>
                    <Label style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
                        {tag}
                    </Label>
                </View>
            )}

            {!badges ? null : (
                <View style={styles.badgeContainer}>
                    {badges.map((icon) => (
                        <View style={[styles.badgeFrame, styleBadgeFrame]}>
                            <Icon name={icon} color={colorBadge} size={badgeIconSize} />
                        </View>
                    ))}
                </View>
            )}        

            {!happening ? null : (
                <View style={styles.indicator}>
                    <Indicator color={done ? theme.important : theme.invText} />
                </View>
            )}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        minHeight: 80,
        marginVertical: 15,
        borderRadius: 16,
        overflow: "hidden",
        flexDirection: "row",
    },
    glyphContainer: {
        position: "absolute",
        left: -20,
        top: -20,
        right: -20,
        bottom: -20,
        alignItems: "center",
        justifyContent: "center",
    },
    glyph: {
        opacity: 0.2,
        transform: [{ rotate: "-15deg" }],
    },
    badgeContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        flexDirection: "row",
    },
    badgeFrame: {
        borderRadius: 16,
        flex: 1,
        padding: 4,
        margin: 8,
    },
    pre: {
        overflow: "hidden",
        width: 70,
        alignItems: "center",
        justifyContent: "center",
    },
    mainPoster: {
        height: 120,
        flex: 1,
        padding: 16,
    },
    mainText: {
        flex: 1,
        padding: 16,
    },
    subtitleArea: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    tag: {
        textAlign: "right",
    },
    tagArea: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "#000000A0",
        paddingLeft: 16,
        paddingBottom: 16,
        paddingRight: 16,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    indicator: {
        position: "absolute",
        top: 0,
        left: 0,
        padding: 14,
    },
});
