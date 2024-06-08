import { FC, RefObject, useContext, useMemo } from "react";
import { Linking } from "react-native";

import { PagerPrimary } from "./PagerPrimary";
import { AuthContext } from "../../context/AuthContext";
import { useAdditionalServices } from "../../hooks/callbacks/useAdditionalServices";
import { useFursuitGames } from "../../hooks/callbacks/useFursuitGames";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { RecordId } from "../../store/eurofurence.types";
import { Tab } from "../generic/containers/Tab";
import { TabsRef } from "../generic/containers/Tabs";

export type MainMenuProps = {
    tabs: RefObject<TabsRef>;
};

export const MainMenu: FC<MainMenuProps> = ({ tabs }) => {
    const navigation = useAppNavigation("Areas");
    const openFursuitGames = useFursuitGames();
    const openAdditionalServices = useAdditionalServices();

    const { login } = useContext(AuthContext);
    const on = useMemo(
        () => ({
            login: () => {
                login();
                // TODO
                // pager.current?.toRight()
            },
            messages: () => {
                navigation.navigate("PrivateMessageList");
                return tabs.current?.close();
            },
            info: () => {
                navigation.navigate("KnowledgeGroups", {});
                tabs.current?.close();
            },
            catchEmAll: () => {
                openFursuitGames();
                tabs.current?.close();
            },
            services: () => {
                openAdditionalServices();
                return tabs.current?.close();
            },
            settings: () => {
                navigation.navigate("Settings");
                tabs.current?.close();
            },
            about: () => {
                navigation.navigate("About");
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
            onInfo={on.info}
            onCatchEmAll={on.catchEmAll}
            onServices={on.services}
            onSettings={on.settings}
            onAbout={on.about}
            onMap={on.map}
        >
            <Tab icon={"twitter"} text={"Twitter"} onPress={() => Linking.openURL("https://twitter.com/eurofurence")} />
        </PagerPrimary>
    );
};
