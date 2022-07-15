import { orderBy } from "lodash";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Row } from "../../components/Containers/Row";

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
        },
        []
    );

    return (
        <View>
            <Section title={t("settingsSection")} icon={"cog"} />
            <Label mb={15}>{t("currentLanguage")}</Label>
            <Row>
                {languages.map((it) => (
                    <Button onPress={changeLanguage(it.code)} key={it.code} outline={i18n.language === it.code}>
                        {it.name}
                    </Button>
                ))}
            </Row>
        </View>
    );
};
