import { captureException } from "@sentry/react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { SettingContainer } from "./SettingContainer";
import { authSettingsUrl, conName } from "../../configuration";
import { useAuthContext } from "../../context/AuthContext";
import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { assetSource } from "../../util/assets";
import { Image } from "../generic/atoms/Image";
import { Label } from "../generic/atoms/Label";
import { Button } from "../generic/containers/Button";

/**
 * Login mask that shows login form or displays current user and dispatches user
 * logout.
 * @constructor
 */
export const CurrentLogin = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "login" });
    const { loggedIn, user, login, logout } = useAuthContext();
    const avatarBackground = useThemeBackground("primary");

    if (!loggedIn || !user)
        return (
            <SettingContainer>
                <Label variant="bold">{t("not_logged_in")}</Label>
                <Label mb={15} variant="narrow">
                    {t("login_description", { conName })}
                </Label>

                <Button iconRight="login" onPress={() => login().catch(captureException)}>
                    {t("logged_in_now")}
                </Button>
            </SettingContainer>
        );
    else
        return (
            <SettingContainer>
                <Label variant="bold">{t("logged_in_as", { username: user.name })}</Label>
                <Label variant="narrow">{t("login_description", { conName })}</Label>

                <TouchableOpacity containerStyle={styles.avatarContainer} disabled={!authSettingsUrl} onPress={() => Linking.openURL(authSettingsUrl).catch(captureException)}>
                    <Image
                        style={[avatarBackground, styles.avatarCircle]}
                        source={user.avatar ?? assetSource("ych")}
                        contentFit="contain"
                        placeholder="ych"
                        transition={60}
                        cachePolicy="memory"
                        priority="high"
                    />
                </TouchableOpacity>

                <Button icon="logout" onPress={() => logout().catch(captureException)}>
                    {t("logout")}
                </Button>
            </SettingContainer>
        );
};

const styles = StyleSheet.create({
    avatarContainer: {
        margin: 25,
        alignSelf: "center",
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
});
