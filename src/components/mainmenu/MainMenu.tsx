import { RefObject, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet } from "react-native";
import { router } from "expo-router";

import { conWebsite } from "@/configuration";
import { TabsRef } from "@/components/generic/containers/Tabs";
import { Tab } from "@/components/generic/containers/Tab";
import { Grid } from "@/components/generic/containers/Grid";
import { Col } from "@/components/generic/containers/Col";

export type MainMenuProps = {
    tabs: RefObject<TabsRef>;
};

export function MainMenu({ tabs }: MainMenuProps) {
    const { t } = useTranslation("Menu");

    const handleNavigation = useCallback((path: string) => {
        router.push(path);
        tabs.current?.close();
    }, [tabs]);

    return (
        <Col type="stretch">
            <Grid cols={4}>
                <Tab 
                    icon="information-outline" 
                    text={t("info")} 
                    onPress={() => handleNavigation("/info")} 
                />
                <Tab 
                    icon="card-account-details-outline" 
                    text={t("profile")} 
                    onPress={() => handleNavigation("/profile")} 
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
        </Col>
    );
} 