import { captureException } from "@sentry/react-native";
import { FC, RefObject, useContext, useMemo } from "react";
import { Linking } from "react-native";

import { PagerPrimary } from "./PagerPrimary";
import { appBase } from "../../configuration";
import { AuthContext, getAccessToken } from "../../context/AuthContext";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { RecordId } from "../../store/eurofurence/types";
import { Tab } from "../generic/containers/Tab";
import { TabsRef } from "../generic/containers/Tabs";

export type MainMenuProps = {
    tabs: RefObject<TabsRef>;
};

const openFursuitGames = async () => {
    const token = await getAccessToken();
    if (!token) {
        alert("You are not logged in.");
        return;
    }
    await Linking.openURL(`${appBase}/companion/#/login?embedded=false&returnPath=/collect&token=${token}`).catch(console.error);
};

const openAdditionalServices = async () => {
    const token = await getAccessToken();
    if (!token) {
        alert("You are not logged in.");
        return;
    }
    await Linking.openURL(`${appBase}/companion/#/login?embedded=false&returnPath=/&token=${token}`).catch(console.error);
};

export const MainMenu: FC<MainMenuProps> = ({ tabs }) => {
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
                openFursuitGames().catch(captureException);
                tabs.current?.close();
            },
            services: () => {
                openAdditionalServices().catch(captureException);
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
        [tabs, openFursuitGames, openAdditionalServices, login],
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
            <Tab icon="twitter" text="Twitter" onPress={() => Linking.openURL("https://twitter.com/eurofurence")} />
        </PagerPrimary>
    );
};
