import React, { FC, memo, ReactNode, useMemo } from "react";
import { ColorValue, ImageBackground, ImageSourcePropType, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import Icon, { IconNames } from "../../components/Atoms/Icon";
import { Indicator } from "../../components/Atoms/Indicator";
import { Label } from "../../components/Atoms/Label";
import { Row } from "../../components/Containers/Row";
import { useTheme } from "../../context/Theme";
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
    const styleBadgeFrame = useMemo<ViewStyle>(() => ({ backgroundColor: theme.secondary }), [theme]);
    const colorBadge = useMemo<ColorValue>(() => theme.white, [theme]);
    const colorGlyph = useMemo<ColorValue>(() => theme.lighten, [theme]);
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
                    <ImageBackground source={poster} resizeMode={"cover"} style={StyleSheet.absoluteFill}>
                        <View style={styles.tagArea2}>
                            <View style={styles.tagAreaInner}>
                                <Label style={styles.tag} type="regular" color="white" ellipsizeMode="head" numberOfLines={1}>
                                    {title} {subtitle}
                                </Label>
                                {tag && (
                                    <Label style={styles.tag} type="regular" color="white" ellipsizeMode="head" numberOfLines={1}>
                                        {tag}
                                    </Label>
                                )}
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            ) : (
                <View style={styles.mainText}>
                    <Row>
                        <Label style={styles.title} type="h3">
                            {title}
                        </Label>

                        {badges?.map((icon) => (
                            <View key={icon} style={[styles.badgeFrame, styleBadgeFrame]}>
                                <Icon name={icon} color={colorBadge} size={badgeIconSize} />
                            </View>
                        )) ?? null}
                    </Row>
                    <Label type="h4" variant="narrow">
                        {subtitle}
                    </Label>
                    <Label style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
                        {tag}
                    </Label>
                </View>
            )}

            {!happening ? null : (
                <View style={styles.indicator}>
                    <Indicator color={theme.white} />
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
        opacity: 0.25,
        transform: [{ rotate: "-15deg" }],
    },
    badgeFrame: {
        borderRadius: 20,
        aspectRatio: 1,
        padding: 4,
        marginLeft: 8,
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
    title: {
        flex: 1,
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
        paddingTop: 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    tagArea2: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignContent: "flex-start",
        alignItems: "stretch",

        height: "100%",
    },
    tagAreaInner: {
        backgroundColor: "#000000A0",
        padding: 8,
        justifyContent: "space-between",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    indicator: {
        position: "absolute",
        top: 0,
        left: 0,
        padding: 14,
    },
});
