import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { devMenu } from "@/configuration";
import { Floater } from "@/components/generic/containers/Floater";
import { UserSettings } from "@/components/settings/UserSettings";
import { CacheStats } from "@/components/settings/CacheStats";
import { TimeTravel } from "@/components/settings/TimeTravel";
import { ScheduledNotifications } from "@/components/settings/ScheduledNotifications";
import { RemoteMessages } from "@/components/settings/RemoteMessages";
import { DevButtons } from "@/components/settings/DevButtons";
import { useThemeBackground } from "@/hooks/themes/useThemeHooks";
import { Header } from "@/components/generic/containers/Header";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
    const [showDevMenu, setShowDevMenu] = React.useState(false);
    const backgroundStyle = useThemeBackground("background");
    const { t } = useTranslation("Settings");

    // TODO: Implement a way to toggle dev menu, possibly through multiple taps on version number
    React.useEffect(() => {
        // For development, temporarily enable dev menu
        setShowDevMenu(devMenu);
    }, []);

    return (
        <>
            <ScrollView 
                style={[StyleSheet.absoluteFill, backgroundStyle]} 
                stickyHeaderIndices={[0]} 
                stickyHeaderHiddenOnScroll
                className="flex-1"
            >
                <Header>{t("header")}</Header>
                <Floater contentStyle={styles.content}>
                    <UserSettings />

                    {showDevMenu && (
                        <>
                            <CacheStats />
                            <TimeTravel />
                            <ScheduledNotifications />
                            <RemoteMessages />
                            <DevButtons />
                        </>
                    )}
                </Floater>
            </ScrollView>
        </>
    );
} 

const styles = StyleSheet.create({
    content: {
        marginBottom: 16, // Equivalent to appStyles.trailer
    }
}); 