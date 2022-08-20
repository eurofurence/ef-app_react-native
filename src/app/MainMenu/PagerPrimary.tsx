import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../components/Containers/Button";
import { Col } from "../../components/Containers/Col";
import { Grid } from "../../components/Containers/Grid";
import { Tab } from "../../components/Containers/Tab";
import { useTabs } from "../../components/Containers/Tabs";
import { useAppSelector } from "../../store";
import { selectBrowseableMaps } from "../../store/eurofurence.selectors";
import { RecordId } from "../../store/eurofurence.types";
import { PrivateMessageLinker } from "../PrivateMessages/PrivateMessageLinker";

/**
 * Props to the pager.
 */
export type PagerMenuProps = {
    onMessages?: () => void;
    onLogin?: () => void;
    onInfo?: () => void;
    onCatchEmAll?: () => void;
    onServices?: () => void;
    onMaps?: () => void;
    onAbout?: () => void;
    onSettings?: () => void;
    onMap?: (id: RecordId) => void;
};

export const PagerPrimary: FC<PagerMenuProps> = ({ onMessages, onLogin, onInfo, onCatchEmAll, onServices, onMaps, onAbout, onSettings, onMap, children }) => {
    const { t } = useTranslation("Menu");
    const loggedIn = useAppSelector((state) => state.authorization.isLoggedIn);
    const maps = useAppSelector(selectBrowseableMaps);
    const tabs = useTabs();

    return (
        <Col type="stretch">
            {loggedIn ? (
                <PrivateMessageLinker onOpenMessages={onMessages} open={tabs.isOpen} />
            ) : (
                <View style={{ padding: 30 }}>
                    <Text style={styles.marginBefore}>{t("not_logged_in")}</Text>
                    <Button style={styles.marginBefore} icon="login" onPress={onLogin}>
                        {t("logged_in_now")}
                    </Button>
                </View>
            )}
            <Grid cols={3} style={{ alignSelf: "stretch" }}>
                <Tab icon="information-outline" text={t("info")} onPress={onInfo} />
                <Tab icon="paw" text={t("catch_em")} onPress={onCatchEmAll} />
                <Tab icon="book-outline" text={t("services")} onPress={onServices} />
                <Tab icon="card-account-details-outline" text={t("about")} onPress={onAbout} />
                <Tab icon="cog" text={t("settings")} onPress={onSettings} />
                {children}
            </Grid>
            <Col style={{ padding: 30, alignItems: "stretch" }}>
                {maps.map((it) => (
                    <Button key={it.Id} style={{ marginVertical: 10 }} icon={"map"} onPress={() => onMap && onMap(it.Id)}>
                        {it.Description}
                    </Button>
                ))}
            </Col>
        </Col>
    );
};

const styles = StyleSheet.create({
    marginAfter: {
        marginBottom: 16,
    },
    marginBefore: {
        marginTop: 16,
    },
    rowLeft: {
        flex: 1,
        marginRight: 8,
    },
    rowRight: {
        flex: 1,
        marginLeft: 8,
    },
});
