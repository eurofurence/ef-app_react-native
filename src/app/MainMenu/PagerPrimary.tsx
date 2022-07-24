import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../components/Containers/Button";
import { Col } from "../../components/Containers/Col";
import { Grid } from "../../components/Containers/Grid";
import { Tab } from "../../components/Containers/Tab";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { mapsSelectors } from "../../store/eurofurence.selectors";
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
};

export const PagerPrimary: FC<PagerMenuProps> = ({ onMessages, onLogin, onInfo, onCatchEmAll, onServices, onMaps, onAbout, onSettings }) => {
    const { t } = useTranslation("Menu");
    const navigation = useAppNavigation("Areas");
    const loggedIn = useAppSelector((state) => state.authorization.isLoggedIn);
    const maps = useAppSelector(mapsSelectors.selectBrowseableMaps);

    return (
        <Col type="stretch">
            {loggedIn ? (
                <PrivateMessageLinker onOpenMessages={onMessages} />
            ) : (
                <View style={{ padding: 30 }}>
                    <Text style={styles.marginBefore}>{t("not_logged_in")}</Text>
                    <Button style={styles.marginBefore} icon="login" onPress={onLogin}>
                        {t("logged_in_now")}
                    </Button>
                </View>
            )}
            <Grid cols={3} style={{ alignSelf: "stretch" }}>
                <Tab icon="information-outline" text={t("info")} onPress={() => navigation.navigate("KnowledgeGroups", {})} />
                <Tab icon="paw" text={t("catch_em")} onPress={onCatchEmAll} />
                <Tab icon="book-outline" text={t("services")} onPress={onServices} />
                <Tab icon="map" text={t("maps")} onPress={onMaps} />
                <Tab icon="card-account-details-outline" text={t("about")} onPress={onAbout} />
                <Tab icon="cog" text={t("settings")} onPress={onSettings} />
            </Grid>
            <Col style={{ padding: 30, alignItems: "stretch" }}>
                {maps.map((it) => (
                    <Button key={it.Id} style={{ marginVertical: 10 }} icon={"map"} onPress={() => navigation.navigate("Map", { id: it.Id })}>
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
