import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { FeedbackForm } from "../../components/feedback/FeedbackForm";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence/selectors/records";

export const EventFeedback = () => {
    const { t } = useTranslation("EventFeedback");

    const { params } = useAppRoute("EventFeedback");
    const event = useAppSelector((state) => eventsSelector.selectById(state, params.id));

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]}>
            <Header>{t("header", { eventTitle: event?.Title, interpolation: { escapeValue: false } })}</Header>
            <Floater containerStyle={{ marginTop: 10 }}>
                <FeedbackForm />
            </Floater>
        </ScrollView>
    );
};
