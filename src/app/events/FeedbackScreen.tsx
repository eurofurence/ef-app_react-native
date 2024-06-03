import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FeedbackForm } from "../../components/app/forms/feedback/FeedbackForm";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence.selectors";

export const FeedbackScreen = () => {
    const { t } = useTranslation("EventFeedback");

    const safe = useSafeAreaInsets();
    const { params } = useAppRoute("EventFeedback");
    const event = useAppSelector((state) => eventsSelector.selectById(state, params.id));

    return (
        <ScrollView style={safe} stickyHeaderIndices={[0]}>
            <Header>{t("header", { eventTitle: event?.Title, interpolation: { escapeValue: false } })}</Header>
            <Floater containerStyle={{ marginTop: 10 }}>
                <FeedbackForm />
            </Floater>
        </ScrollView>
    );
};
