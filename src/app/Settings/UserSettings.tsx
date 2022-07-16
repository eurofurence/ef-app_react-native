import { orderBy } from "lodash";
import moment from "moment";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Col } from "../../components/Containers/Col";

type Language = {
    code: string;
    name: string;
};
const languages = orderBy(
    [
        { code: "en", name: "🇬🇧 English" },
        { code: "de", name: "🇩🇪 Deutsch" },
        { code: "nl", name: "🇳🇱 Nederlands" },
    ] as Language[],
    (value) => value.code,
    "asc"
);
export const UserSettings = () => {
    const { t, i18n } = useTranslation("Settings");

    const changeLanguage = useCallback(
        (newLanguage: string) => () => {
            i18n.changeLanguage(newLanguage);
            moment.locale(newLanguage);
        },
        []
    );

    return (
        <View>
            <Section title={t("settingsSection")} icon={"cog"} />
            <Label>{t("currentLanguage")}</Label>
            <Col type="stretch">
                {languages.map((it) => (
                    <Button style={styles.marginBefore} onPress={changeLanguage(it.code)} key={it.code} outline={i18n.language === it.code}>
                        {it.name}
                    </Button>
                ))}
            </Col>
        </View>
    );
};

const styles = StyleSheet.create({
    marginBefore: {
        marginTop: 16,
    },
});
