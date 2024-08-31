import React, { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { menuColumns, showCatchEm, showLogin } from "../../configuration";
import { Claims, useAuthContext } from "../../context/AuthContext";
import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { useAppSelector } from "../../store";
import { selectBrowsableMaps } from "../../store/eurofurence/selectors/maps";
import { useArtistAlleyOwnTableRegistrationQuery } from "../../store/eurofurence/service";
import { ArtistAlleyOwnTableRegistrationRecord, RecordId } from "../../store/eurofurence/types";
import { assetSource } from "../../util/assets";
import { Icon } from "../generic/atoms/Icon";
import { Image } from "../generic/atoms/Image";
import { Button } from "../generic/containers/Button";
import { Col } from "../generic/containers/Col";
import { Grid } from "../generic/containers/Grid";
import { Row } from "../generic/containers/Row";
import { Tab } from "../generic/containers/Tab";
import { useTabs } from "../generic/containers/Tabs";
import { PrivateMessageLinker } from "../pm/PrivateMessageLinker";

type PagerPrimaryLoginProps = {
    loggedIn: boolean;
    claim: Claims | null;
    open: boolean;
    onMessages?: () => void;
    onLogin?: () => void;
    onProfile?: () => void;
};
const PagerPrimaryLogin: FC<PagerPrimaryLoginProps> = ({ loggedIn, claim, open, onMessages, onLogin, onProfile }) => {
    const { t } = useTranslation("Menu");
    const avatarBackground = useThemeBackground("primary");
    // TODO: Verify style of name etc.
    return (
        <Row style={styles.padding} type="center" variant="center">
            <TouchableOpacity disabled={!loggedIn || !onProfile} onPress={() => onProfile?.()}>
                <Image
                    style={[avatarBackground, styles.avatarCircle]}
                    source={claim?.avatar ?? assetSource("ych")}
                    contentFit="contain"
                    placeholder="ych"
                    transition={60}
                    cachePolicy="memory"
                    priority="high"
                />
            </TouchableOpacity>

            {/*<Label style={styles.marginBefore} type="caption">*/}
            {/*    {t("not_logged_in")}*/}
            {/*</Label>*/}

            {loggedIn ? (
                <PrivateMessageLinker containerStyle={styles.grow} style={styles.button} claims={claim} onOpenMessages={onMessages} open={open} />
            ) : (
                <Button containerStyle={styles.grow} style={styles.button} iconRight="login" onPress={onLogin}>
                    {t("logged_in_now")}
                </Button>
            )}
        </Row>
    );
};

/**
 * Props to the pager.
 */
export type PagerMenuProps = PropsWithChildren<{
    onMessages?: () => void;
    onLogin?: () => void;
    onProfile?: () => void;
    onInfo?: () => void;
    onCatchEmAll?: () => void;
    onArtistAlley?: () => void;
    onSettings?: () => void;
    onMap?: (id: RecordId) => void;
}>;

const ArtistAlleyIndicator = ({ state }: { state: ArtistAlleyOwnTableRegistrationRecord["State"] }) => {
    if (state === "Accepted" || state === "Published") {
        return <Icon style={artistAlleyIndicatorStyles.trimMargin} name="check" size={12} color="white" />;
    } else if (state === "Rejected") {
        return <Icon style={artistAlleyIndicatorStyles.trimMargin} name="window-close" size={12} color="white" />;
    } else {
        return <Icon style={artistAlleyIndicatorStyles.trimMargin} name="timer" size={12} color="white" />;
    }
};

const artistAlleyIndicatorStyles = StyleSheet.create({
    trimMargin: {
        margin: -3,
    },
});

export const PagerPrimary: FC<PagerMenuProps> = ({ onMessages, onLogin, onProfile, onInfo, onCatchEmAll, onArtistAlley, onSettings, onMap, children }) => {
    const { t } = useTranslation("Menu");
    const { loggedIn, claims } = useAuthContext();
    const maps = useAppSelector(selectBrowsableMaps);
    const tabs = useTabs();

    // Get artist alley reg data if logged in.
    const { data } = useArtistAlleyOwnTableRegistrationQuery(undefined, {
        skip: !loggedIn,
        refetchOnFocus: true,
    });

    return (
        <Col type="stretch">
            {!showLogin ? null : <PagerPrimaryLogin loggedIn={loggedIn} claim={claims} open={tabs.isOpen} onMessages={onMessages} onLogin={onLogin} onProfile={onProfile} />}

            <Grid cols={menuColumns} style={{ alignSelf: "stretch" }}>
                <Tab icon="information-outline" text={t("info")} onPress={onInfo} />
                {!showCatchEm ? null : <Tab icon="paw" text={t("catch_em")} onPress={onCatchEmAll} />}
                <Tab icon="image-frame" text={t("artist_alley")} onPress={onArtistAlley} indicate={data ? <ArtistAlleyIndicator state={data.State} /> : false} />
                <Tab icon="card-account-details-outline" text={t("profile")} onPress={onProfile} disabled={!loggedIn} />
                <Tab icon="cog" text={t("settings")} onPress={onSettings} />
                {children}
            </Grid>

            <Col style={{ padding: 30, alignItems: "stretch" }}>
                {maps.map((it) => (
                    <Button key={it.Id} containerStyle={{ marginVertical: 10 }} icon="map" onPress={() => onMap && onMap(it.Id)}>
                        {it.Description}
                    </Button>
                ))}
            </Col>
        </Col>
    );
};

const styles = StyleSheet.create({
    rowLeft: {
        flex: 1,
        marginRight: 8,
    },
    rowRight: {
        flex: 1,
        marginLeft: 8,
    },
    padding: {
        paddingHorizontal: 30,
        paddingVertical: 15,
    },
    grow: {
        flexGrow: 1,
    },
    button: {
        marginLeft: 16,
    },
    avatarCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
});
