import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../../components/app/AppStyles";
import { DealerContent } from "../../components/app/dealers/DealerContent";
import { Floater, padFloater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { dealersSelectors } from "../../store/eurofurence.selectors";

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
    const safe = useSafeAreaInsets();

    return (
        <ScrollView style={[appStyles.abs, safe]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{dealer?.FullName ?? t("viewing_dealer")}</Header>
            <Floater contentStyle={appStyles.trailer}>{!dealer ? null : <DealerContent dealer={dealer} parentPad={padFloater} />}</Floater>
        </ScrollView>
    );
};
