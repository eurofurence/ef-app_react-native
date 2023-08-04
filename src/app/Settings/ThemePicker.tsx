import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { SettingContainer } from "./SettingContainer";
import { Label } from "../../components/Atoms/Label";
import { Button } from "../../components/Containers/Button";
import { Col } from "../../components/Containers/Col";
import { Row } from "../../components/Containers/Row";
import { useAppDispatch, useAppSelector } from "../../store";
import { setTheme } from "../../store/settings.slice";

const usableThemes = [undefined, "light", "dark"];

/**
 * Shows currently selected theme and dispatches theme selector on change of
 * selection.
 * @constructor
 */
export const ThemePicker = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "theme" });
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.settingsSlice.theme);

    return (
        <SettingContainer>
            <Col type={"stretch"}>
                <Label variant={"bold"}>{t("title")}</Label>
                <Label variant={"narrow"}>{t("description")}</Label>

                <Row type={"center"} variant={"center"} style={styles.selector}>
                    <Button style={[styles.button, styles.left]} outline={theme === undefined} onPress={() => dispatch(setTheme(undefined))}>
                        {t("system")}
                    </Button>
                    {!usableThemes.includes(theme) && (
                        <Button style={styles.button} outline onPress={() => setTheme(theme)}>
                            {_.capitalize(theme)}
                        </Button>
                    )}
                    <Button style={styles.button} outline={theme === "light"} onPress={() => dispatch(setTheme("light"))}>
                        {t("light")}
                    </Button>
                    <Button style={[styles.button, styles.right]} outline={theme === "dark"} onPress={() => dispatch(setTheme("dark"))}>
                        {t("dark")}
                    </Button>
                </Row>
            </Col>
        </SettingContainer>
    );
};

const styles = StyleSheet.create({
    selector: {
        marginTop: 16,
    },
    button: {
        flexGrow: 1,
        borderRadius: 0,
    },
    left: {
        borderBottomLeftRadius: 16,
        borderTopLeftRadius: 16,
    },
    right: {
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },
});
