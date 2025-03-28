import React from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import { Claims } from "@/context/AuthContext";
import { useThemeBackground } from "@/hooks/themes/useThemeHooks";
import { Image } from "@/components/generic/atoms/Image";
import { Label } from "@/components/generic/atoms/Label";
import { Button } from "@/components/generic/containers/Button";
import { Col } from "@/components/generic/containers/Col";
import { Row } from "@/components/generic/containers/Row";

type PagerPrimaryLoginProps = {
    loggedIn: boolean;
    claim: Claims | null;
    open: boolean;
    onMessages?: () => void;
    onLogin?: () => void;
    onProfile?: () => void;
};

export function PagerPrimaryLogin({ loggedIn, claim, open, onMessages, onLogin, onProfile }: PagerPrimaryLoginProps) {
    const { t } = useTranslation("Menu");
    const avatarBackground = useThemeBackground("primary");

    return (
        <Row style={styles.padding} type="start" variant="center">
            <TouchableOpacity disabled={!loggedIn || !onProfile} onPress={() => onProfile?.()}>
                <Col type="center">
                    <Image
                        style={[avatarBackground, styles.avatarCircle]}
                        source={claim?.avatar ?? require("@/assets/static/ych.png")}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                        priority="high"
                    />
                </Col>
                {!claim?.name ? null : (
                    <Label style={styles.name} type="minor" mt={4} ellipsizeMode="tail" numberOfLines={1}>
                        {claim.name}
                    </Label>
                )}
            </TouchableOpacity>

            {loggedIn ? (
                <Button
                    containerStyle={styles.buttonContainer}
                    style={styles.button}
                    icon="message"
                    onPress={onMessages}
                >
                    {t("open_messages")}
                </Button>
            ) : (
                <Button
                    containerStyle={styles.buttonContainer}
                    style={styles.button}
                    iconRight="login"
                    onPress={onLogin}
                >
                    {t("logged_in_now")}
                </Button>
            )}
        </Row>
    );
}

const styles = StyleSheet.create({
    padding: {
        paddingHorizontal: 30,
        paddingVertical: 15,
    },
    buttonContainer: {
        flexGrow: 1,
        flexShrink: 1,
    },
    name: {
        maxWidth: 60,
        textAlign: "center",
    },
    button: {
        marginLeft: 16,
    },
    avatarCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
});