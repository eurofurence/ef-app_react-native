import { capitalize } from "lodash";
import { useTranslation } from "react-i18next";

import { SettingContainer } from "./SettingContainer";
import { conName } from "../../../configuration";
import { useAppDispatch, useAppSelector } from "../../../store";
import { logout } from "../../../store/authorization.slice";
import { Label } from "../../generic/atoms/Label";
import { Button } from "../../generic/containers/Button";
import { LoginForm } from "../forms/login/LoginForm";

/**
 * Login mask that shows login form or displays current user and dispatches user
 * logout.
 * @constructor
 */
export const LoginFormOrDisplay = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "login" });
    const auth = useAppSelector((state) => state.authorization);
    const dispatch = useAppDispatch();

    if (!auth.isLoggedIn) {
        return (
            <>
                <Label variant={"bold"}>{t("login")}</Label>
                <LoginForm />
            </>
        );
    }

    return (
        <SettingContainer>
            <Label variant={"bold"}>{t("logged_in_as", { username: capitalize(auth.username) })}</Label>
            <Label variant={"narrow"}>{t("login_description", { conName })}</Label>
            <Button icon="logout" onPress={() => dispatch(logout())} style={{ marginTop: 15 }}>
                {t("logout")}
            </Button>
        </SettingContainer>
    );
};
