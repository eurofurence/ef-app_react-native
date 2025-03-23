import { RefObject, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet } from "react-native";
import { router } from "expo-router";

import { catchEmUrl, conWebsite, menuColumns, showCatchEm, showLogin } from "@/configuration";
import { TabsRef } from "@/components/generic/containers/Tabs";
import { Tab } from "@/components/generic/containers/Tab";
import { Grid } from "@/components/generic/containers/Grid";
import { Col } from "@/components/generic/containers/Col";
import { useAuthContext, getAccessToken } from "@/context/AuthContext";
import { useDataCache } from "@/context/DataCacheProvider";
import { Button } from "@/components/generic/containers/Button";
import { MapRecord } from "@/store/eurofurence/types";
import { PagerPrimaryLogin } from "@/components/mainmenu/PagerPrimaryLogin";
import { captureException } from "@sentry/react-native";

export type MainMenuProps = {
    tabs: RefObject<TabsRef>;
};

export function MainMenu({ tabs }: MainMenuProps) {
    const { t } = useTranslation("Menu");
    const { loggedIn, claims, login } = useAuthContext();
    const { getAllCacheSync } = useDataCache();

    // Get browsable maps from cache
    const maps = useMemo(() => {
        const allMaps = getAllCacheSync("maps")
            .map(item => item.data as MapRecord)
            .filter(map => map.IsBrowseable);
        return allMaps;
    }, [getAllCacheSync]);

    const handleNavigation = useCallback((path: string) => {
        router.push(path);
        tabs.current?.close();
    }, [tabs]);

    // TODO: Check why a page is not being opened.
    const handleLogin = useCallback(() => {
        login().catch(captureException);
    }, [login]);

    const handleCatchEmAll = useCallback(async () => {
        const token = await getAccessToken();
        if (!token) {
            alert(t("not_logged_in"));
            return;
        }
        await Linking.openURL(catchEmUrl).catch(console.error);
        tabs.current?.close();
    }, [t, tabs]);

    return (
        <Col type="stretch">
            {showLogin && (
                <PagerPrimaryLogin 
                    loggedIn={loggedIn}
                    claim={claims}
                    open={!!tabs.current?.open}
                    onMessages={() => handleNavigation("/messages")}
                    onLogin={handleLogin}
                    onProfile={() => handleNavigation("/profile")}
                />
            )}

            <Grid cols={menuColumns}>
                <Tab 
                    icon="information-outline" 
                    text={t("info")} 
                    onPress={() => handleNavigation("/info")} 
                />
                {showCatchEm && (
                    <Tab 
                        icon="paw" 
                        text={t("catch_em")} 
                        onPress={handleCatchEmAll} 
                    />
                )}
                <Tab 
                    icon="image-frame" 
                    text={t("artist_alley")} 
                    onPress={() => handleNavigation("/artist-alley")} 
                />
                <Tab 
                    icon="card-account-details-outline" 
                    text={t("profile")} 
                    onPress={() => handleNavigation("/profile")} 
                    disabled={!loggedIn}
                />
                <Tab 
                    icon="cog" 
                    text={t("settings")} 
                    onPress={() => handleNavigation("/settings")} 
                />
                <Tab 
                    icon="web" 
                    text={t("website")} 
                    onPress={() => Linking.openURL(conWebsite)} 
                />
            </Grid>

            <Col style={styles.mapsContainer}>
                {maps.map((map) => (
                    <Button 
                        key={map.Id} 
                        containerStyle={styles.mapButton} 
                        icon="map" 
                        onPress={() => handleNavigation(`/map/${map.Id}`)}
                    >
                        {map.Description}
                    </Button>
                ))}
            </Col>
        </Col>
    );
}

const styles = StyleSheet.create({
    mapsContainer: {
        padding: 30,
        alignItems: "stretch"
    },
    mapButton: {
        marginVertical: 10
    }
});
