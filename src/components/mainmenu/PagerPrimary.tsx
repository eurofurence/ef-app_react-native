import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { menuColumns, showCatchEm, showLogin, showServices } from "../../configuration";
import { useAuthContext } from "../../context/AuthContext";
import { useAppSelector } from "../../store";
import { selectBrowsableMaps } from "../../store/eurofurence.selectors";
import { RecordId } from "../../store/eurofurence.types";
import { Label } from "../generic/atoms/Label";
import { Button } from "../generic/containers/Button";
import { Col } from "../generic/containers/Col";
import { Grid } from "../generic/containers/Grid";
import { Tab } from "../generic/containers/Tab";
import { useTabs } from "../generic/containers/Tabs";
import { PrivateMessageLinker } from "../pm/PrivateMessageLinker";

type PagerPrimaryLoginProps = {
    loggedIn: boolean;
    open: boolean;
    onMessages?: () => void;
    onLogin?: () => void;
};
const PagerPrimaryLogin: FC<PagerPrimaryLoginProps> = ({ loggedIn, open, onMessages, onLogin }) => {
    const { t } = useTranslation("Menu");
    if (loggedIn) {
        return <PrivateMessageLinker onOpenMessages={onMessages} open={open} />;
    } else {
        return (
            <View style={{ padding: 30 }}>
                <Label style={styles.marginBefore} type="caption">
                    {t("not_logged_in")}
                </Label>
                <Button containerStyle={styles.marginBefore} icon="login" onPress={onLogin}>
                    {t("logged_in_now")}
                </Button>
            </View>
        );
    }
};

/**
 * Props to the pager.
 */
export type PagerMenuProps = PropsWithChildren<{
    onMessages?: () => void;
    onLogin?: () => void;
    onInfo?: () => void;
    onCatchEmAll?: () => void;
    onServices?: () => void;
    onAbout?: () => void;
    onSettings?: () => void;
    onMap?: (id: RecordId) => void;
}>;

export const PagerPrimary: FC<PagerMenuProps> = ({ onMessages, onLogin, onInfo, onCatchEmAll, onServices, onAbout, onSettings, onMap, children }) => {
    const { t } = useTranslation("Menu");
    const { loggedIn } = useAuthContext();
    const maps = useAppSelector(selectBrowsableMaps);
    const tabs = useTabs();

    return (
        <Col type="stretch">
            {!showLogin ? null : <PagerPrimaryLogin loggedIn={loggedIn} open={tabs.isOpen} onMessages={onMessages} onLogin={onLogin} />}

            <Grid cols={menuColumns} style={{ alignSelf: "stretch" }}>
                <Tab icon="information-outline" text={t("info")} onPress={onInfo} />
                {!showCatchEm ? null : <Tab icon="paw" text={t("catch_em")} onPress={onCatchEmAll} />}
                {!showServices ? null : <Tab icon="book-outline" text={t("services")} onPress={onServices} />}
                <Tab icon="card-account-details-outline" text={t("about")} onPress={onAbout} />
                <Tab icon="cog" text={t("settings")} onPress={onSettings} />
                {children}
            </Grid>

            <Col style={{ padding: 30, alignItems: "stretch" }}>
                {maps.map((it) => (
                    <Button key={it.Id} containerStyle={{ marginVertical: 10 }} icon={"map"} onPress={() => onMap && onMap(it.Id)}>
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