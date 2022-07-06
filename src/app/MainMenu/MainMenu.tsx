import { FC, MutableRefObject, useMemo, useRef } from "react";

import { Pager } from "../../components/Containers/Pager";
import { TabsRef } from "../../components/Containers/Tabs";
import { PagerLogin } from "./PagerLogin";
import { PagerPrimary } from "./PagerPrimary";

export interface MainMenuProps {
    tabs: MutableRefObject<TabsRef | undefined>;
}
export const MainMenu: FC<MainMenuProps> = ({ tabs }) => {
    const pager = useRef<any>();
    const on = useMemo(
        () => ({
            home: () => tabs.current?.close(),
            events: () => tabs.current?.close(),
            dealers: () => tabs.current?.close(),
            login: () => pager.current?.toRight(),
            loginBack: () => pager.current?.toLeft(),
            messages: () => tabs.current?.close(),
            info: () => tabs.current?.close(),
            catchEmAll: () => tabs.current?.close(),
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
                    onSettings={on.settings}
                    onAbout={on.about}
                />
            }
            right={<PagerLogin close={on.loginBack} />}
        />
    );
};
