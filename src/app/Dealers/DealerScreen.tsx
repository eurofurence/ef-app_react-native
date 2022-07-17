import { useRoute } from "@react-navigation/core";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useTopHeaderStyle } from "../../hooks/useTopHeaderStyle";
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
    const route = useRoute<Route<DealerScreenParams, "Dealer">>();
    const dealer = useAppSelector((state) => dealersCompleteSelectors.selectById(state, route.params.id));
    const headerStyle = useTopHeaderStyle();

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{dealer?.FullName ?? t("viewing_dealer")}</Header>
            <Scroller>{!dealer ? null : <DealerContent dealer={dealer} />}</Scroller>
        </View>
    );
};
