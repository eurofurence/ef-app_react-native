import { Moment } from "moment";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { AnnouncementCard } from "./AnnouncementCard";
import { useAppSelector } from "../../store";
import { selectActiveAnnouncements } from "../../store/eurofurence.selectors";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";

export type AnnouncementListProps = {
    now: Moment;
};
export const AnnouncementList: FC<AnnouncementListProps> = ({ now }) => {
    const { t } = useTranslation("Announcements");
    const announcements = useAppSelector((state) => selectActiveAnnouncements(state, now));

    return (
        <>
            <Section title={t("sectionTitle")} subtitle={t("sectionSubtitle")} icon={"newspaper"} />

            {announcements.length === 0 ? <Label mb={15}>{t("noAnnouncements")}</Label> : announcements.map((it) => <AnnouncementCard announcement={it} key={it.Id} />)}
        </>
    );
};
