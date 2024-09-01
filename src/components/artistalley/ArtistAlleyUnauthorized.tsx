import { captureException } from "@sentry/react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useAuthContext } from "../../context/AuthContext";
import { Label } from "../generic/atoms/Label";
import { Button } from "../generic/containers/Button";

export type ArtistAlleyUnauthorizedProps = {
    loggedIn: boolean;
    attending: boolean;
    checkedIn: boolean;
};

export const ArtistAlleyUnauthorized = ({ loggedIn, attending, checkedIn }: ArtistAlleyUnauthorizedProps) => {
    // Get translation function.
    const { t } = useTranslation("ArtistAlley");
    const { login } = useAuthContext();

    const disabledReason = (!loggedIn && t("unauthorized_not_logged_in")) || (!attending && t("unauthorized_not_attending")) || (!checkedIn && t("unauthorized_not_checked_in"));

    return (
        <View style={styles.container}>
            <Label type="compact" mt={20}>
                {t("explanation_unauthorized")}

                {disabledReason && (
                    <Label color="important" variant="bold">
                        {" " + disabledReason}
                    </Label>
                )}
            </Label>
            <Button style={styles.button} iconRight="login" onPress={() => login().catch(captureException)}>
                {t("log_in_now")}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 100,
    },
    button: {
        marginTop: 20,
    },
});
