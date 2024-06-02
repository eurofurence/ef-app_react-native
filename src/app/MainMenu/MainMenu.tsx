import { FC, RefObject, useMemo, useRef } from "react";
import { Linking } from "react-native";

import { PagerLogin } from "./PagerLogin";
import { PagerPrimary } from "./PagerPrimary";
import { Pager, PagerRef } from "../../components/Containers/Pager";
import { Tab } from "../../components/Containers/Tab";
import { TabsRef } from "../../components/Containers/Tabs";
import { showLogin } from "../../configuration";
import { useAdditionalServices } from "../../hooks/callbacks/useAdditionalServices";
import { useFursuitGames } from "../../hooks/callbacks/useFursuitGames";
import { useAppNavigation } from "../../hooks/navigation/useAppNavigation";
import { RecordId } from "../../store/eurofurence.types";

export type MainMenuProps = {
    tabs: RefObject<TabsRef>;
};

export const MainMenu: FC<MainMenuProps> = ({ tabs }) => {
    const navigation = useAppNavigation("Areas");
    const pager = useRef<PagerRef>(null);
    const openFursuitGames = useFursuitGames();
    const openAdditionalServices = useAdditionalServices();
    const on = useMemo(
        () => ({
            login: () => pager.current?.toRight(),
            loginBack: () => pager.current?.toLeft(),
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
        [tabs, pager, openFursuitGames, openAdditionalServices],
    );

    // If no login, do not return pager.
    if (!showLogin) {
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
    }

    return (
        <Pager
            ref={pager}
            left={
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
            }
            right={<PagerLogin close={on.loginBack} />}
        />
    );
};
