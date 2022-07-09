import { FC, RefObject, useMemo, useRef } from "react";

import { Pager, PagerRef } from "../../components/Containers/Pager";
import { TabsRef } from "../../components/Containers/Tabs";
import { PagerLogin } from "./PagerLogin";
import { PagerPrimary } from "./PagerPrimary";

export type MainMenuProps = {
    tabs: RefObject<TabsRef>;
};

export const MainMenu: FC<MainMenuProps> = ({ tabs }) => {
    const pager = useRef<PagerRef>(null);
    const on = useMemo(
        () => ({
            login: () => pager.current?.toRight(),
            loginBack: () => pager.current?.toLeft(),
            messages: () => tabs.current?.close(),
            info: () => tabs.current?.close(),
            catchEmAll: () => tabs.current?.close(),
            maps: () => tabs.current?.close(),
            services: () => tabs.current?.close(),
            settings: () => tabs.current?.close(),
            about: () => tabs.current?.close(),
        }),
        [tabs, pager]
    );

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
                    onMaps={on.maps}
                    onSettings={on.settings}
                    onAbout={on.about}
                />
            }
            right={<PagerLogin close={on.loginBack} />}
        />
    );
};
