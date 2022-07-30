import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { annoucenementsSelectors } from "../../store/eurofurence.selectors";
import { AnnouncementItem } from "./AnnouncementItem";

export const AnnouncementList = () => {
    const { t } = useTranslation("Announcements");
    const [now] = useNow();
    const announcements = useAppSelector((state) => annoucenementsSelectors.selectActiveAnnouncements(state, now));

    return (
        <View>
            <Section title={t("sectionTitle")} subtitle={t("sectionSubtitle")} icon={"newspaper"} />

            {announcements.length === 0 ? <Label mb={15}>{t("noAnnouncements")}</Label> : announcements.map((it) => <AnnouncementItem announcement={it} key={it.Id} />)}
        </View>
    );
};
