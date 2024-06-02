import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../../components/app/AppStyles";
import { MarkdownContent } from "../../components/generic/atoms/MarkdownContent";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useMarkCommunicationReadMutation } from "../../store/eurofurence.service";

export const PrivateMessageItemScreen = () => {
    const { params } = useAppRoute("PrivateMessageItem");
    const safe = useSafeAreaInsets();
    const [markRead] = useMarkCommunicationReadMutation();

    useEffect(() => {
        if (params.message.ReadDateTimeUtc === null) {
            console.debug("marking as read", params.message.ReadDateTimeUtc);
            markRead(params.id);
        }
    }, [params.message]);

    return (
        <ScrollView style={[safe]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{params.message.Subject}</Header>
            <Floater contentStyle={appStyles.trailer}>
                <MarkdownContent>{params.message.Message}</MarkdownContent>
            </Floater>
        </ScrollView>
    );
};
