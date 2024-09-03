import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../../components/AppStyles";
import { DealerContent } from "../../components/dealers/DealerContent";
import { Floater, padFloater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useUpdateSinceNote } from "../../hooks/records/useUpdateSinceNote";
import { useLatchTrue } from "../../hooks/util/useLatchTrue";
import { useAppSelector } from "../../store";
import { dealersSelectors } from "../../store/eurofurence/selectors/records";
import { shareDealer } from "./Dealers.common";

/**
 * Params handled by the screen in route.
 */
export type DealerItemParams = {
    /**
     * The ID, needed if the dealer is not passed explicitly, i.e., as an external link.
     */
    id: string;
};

export const DealerItem = () => {
    const { t } = useTranslation("Dealer");
    const route = useAppRoute("Dealer");
    const dealer = useAppSelector((state) => dealersSelectors.selectById(state, route.params.id));

    // Get update note. Latch so it's displayed even if reset in background.
    const updated = useUpdateSinceNote(dealer);
    const showUpdated = useLatchTrue(updated);

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header secondaryIcon="share" secondaryPress={() => dealer && shareDealer(dealer)}>
                {dealer?.FullName ?? t("viewing_dealer")}
            </Header>
            <Floater contentStyle={appStyles.trailer}>{!dealer ? null : <DealerContent dealer={dealer} parentPad={padFloater} updated={showUpdated} />}</Floater>
        </ScrollView>
    );
};
