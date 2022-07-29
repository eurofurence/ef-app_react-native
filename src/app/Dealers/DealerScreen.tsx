import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { dealersCompleteSelectors } from "../../store/eurofurence.selectors";
import { DealerContent } from "./DealerContent";

/**
 * Params handled by the screen in route.
 */
export type DealerScreenParams = {
    /**
     * The ID, needed if the dealer is not passed explicitly, i.e., as an external link.
     */
    id: string;
};

export const DealerScreen = () => {
    const { t } = useTranslation("Dealer");
    const route = useAppRoute("Dealer");
    const dealer = useAppSelector((state) => dealersCompleteSelectors.selectById(state, route.params.id));
    const safe = useSafeAreaInsets();

    return (
        <ScrollView style={safe} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{dealer?.FullName ?? t("viewing_dealer")}</Header>
            <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>{!dealer ? null : <DealerContent dealer={dealer} />}</View>
        </ScrollView>
    );
};
