import { View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { annoucenementsSelectors } from "../../store/eurofurence.selectors";

export const AnnouncementList = () => {
    const [now] = useNow();
    const announcements = useAppSelector((state) => annoucenementsSelectors.selectActiveAnnouncements(state, now));

    return (
        <View>
            <Section title={"Announcements"} subtitle={"Live updates from the convention"} icon={"newspaper"} />

            {announcements.length === 0 ? (
                <Label mb={15}>There are currently no active announcements</Label>
            ) : (
                announcements.map((it) => (
                    <Label key={it.Id} mb={15}>
                        {it.Title}
                    </Label>
                ))
            )}
        </View>
    );
};
