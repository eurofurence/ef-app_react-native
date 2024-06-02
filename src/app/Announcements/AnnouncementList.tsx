import { useTranslation } from "react-i18next";

import { AnnouncementItem } from "./AnnouncementItem";
import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { selectActiveAnnouncements } from "../../store/eurofurence.selectors";

export const AnnouncementList = () => {
    const { t } = useTranslation("Announcements");
    const [now] = useNow();
    const announcements = useAppSelector((state) => selectActiveAnnouncements(state, now));

    return (
        <>
            <Section title={t("sectionTitle")} subtitle={t("sectionSubtitle")} icon={"newspaper"} />

            {announcements.length === 0 ? <Label mb={15}>{t("noAnnouncements")}</Label> : announcements.map((it) => <AnnouncementItem announcement={it} key={it.Id} />)}
        </>
    );
};
