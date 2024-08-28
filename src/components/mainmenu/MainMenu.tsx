import { captureException } from "@sentry/react-native";
import { TFunction } from "i18next";
import { FC, RefObject, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";

import { PagerPrimary } from "./PagerPrimary";
import { appBase, conWebsite } from "../../configuration";
import { AuthContext, getAccessToken } from "../../context/AuthContext";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { RecordId } from "../../store/eurofurence/types";
import { Tab } from "../generic/containers/Tab";
import { TabsRef } from "../generic/containers/Tabs";

export type MainMenuProps = {
    tabs: RefObject<TabsRef>;
};

const openFursuitGames = async (t: TFunction) => {
    const token = await getAccessToken();
    if (!token) {
        alert(t("not_logged_in"));
        return;
    }
    await Linking.openURL(`${appBase}/companion/#/login?embedded=false&returnPath=/collect&token=${token}`).catch(console.error);
};

const openAdditionalServices = async (t: TFunction) => {
    const token = await getAccessToken();
    if (!token) {
        alert(t("not_logged_in"));
        return;
    }
    await Linking.openURL(`${appBase}/companion/#/login?embedded=false&returnPath=/&token=${token}`).catch(console.error);
};

export const MainMenu: FC<MainMenuProps> = ({ tabs }) => {
    const { t } = useTranslation("Menu");
    const navigation = useAppNavigation("Areas");

    const { login } = useContext(AuthContext);
    const on = useMemo(
        () => ({
            login: () => {
                login().catch(captureException);
            },
            profile: () => {
                navigation.navigate("Profile");
                tabs.current?.close();
            },
            messages: () => {
                navigation.navigate("PrivateMessageList");
                tabs.current?.close();
            },
            info: () => {
                navigation.navigate("KnowledgeGroups", {});
                tabs.current?.close();
            },
            catchEmAll: () => {
                openFursuitGames(t).catch(captureException);
                tabs.current?.close();
            },
            services: () => {
                openAdditionalServices(t).catch(captureException);
                tabs.current?.close();
            },
            settings: () => {
                navigation.navigate("Settings");
                tabs.current?.close();
            },
            map: (target: RecordId) => {
                navigation.navigate("Map", { id: target });
                tabs.current?.close();
            },
        }),
        [t, tabs, openFursuitGames, openAdditionalServices, login],
    );

    // If no login, do not return pager.
    return (
        <PagerPrimary
            onMessages={on.messages}
            onLogin={on.login}
            onProfile={on.profile}
            onInfo={on.info}
            onCatchEmAll={on.catchEmAll}
            onServices={on.services}
            onSettings={on.settings}
            onMap={on.map}
        >
            <Tab icon="web" text={t("website")} onPress={() => Linking.openURL(conWebsite)} />
        </PagerPrimary>
    );
};
