import _, { capitalize } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { SettingContainer } from "./SettingContainer";
import { useAppDispatch, useAppSelector } from "../../store";
import { setTheme } from "../../store/settings/slice";
import { ChoiceButtons } from "../generic/atoms/ChoiceButtons";
import { Label } from "../generic/atoms/Label";
import { Col } from "../generic/containers/Col";

const usableThemes = [undefined, "light", "medium", "dark"];

/**
 * Shows currently selected theme and dispatches theme selector on change of
 * selection.
 * @constructor
 */
export const ThemePicker = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "theme" });
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.settingsSlice.theme);
    const choices = usableThemes.includes(theme) ? usableThemes : [usableThemes[0], theme, ...usableThemes.slice(1)];

    return (
        <SettingContainer>
            <Col type="stretch">
                <Label variant="bold">{t("title")}</Label>
                <Label variant="narrow">{t("description")}</Label>

                <ChoiceButtons
                    style={styles.selector}
                    choices={choices}
                    choice={theme}
                    setChoice={(choice) => dispatch(setTheme(choice))}
                    getLabel={(choice) => t(choice ?? "system", capitalize(choice))}
                />
            </Col>
        </SettingContainer>
    );
};

const styles = StyleSheet.create({
    grow: {
        flexGrow: 1,
    },
    selector: {
        marginTop: 16,
    },
    button: {
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
