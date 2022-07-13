import { StackScreenProps } from "@react-navigation/stack";
import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useAppSelector } from "../../store";
import { dealersSelectors } from "../../store/eurofurence.selectors";
import { EnrichedDealerRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { DealerContent } from "./DealerContent";

/**
 * Params handled by the screen in route.
 */
export type DealerScreenParams = {
    /**
     * The ID, needed if the dealer is not passed explicitly, i.e., as an external link.
     */
    id?: string;

    /**
     * The dealer to display.
     */
    dealer?: EnrichedDealerRecord;
};

/**
 * Properties to the screen as a component.
 */
export type DealerScreenProps = StackScreenProps<ScreenStartNavigatorParamsList, "Dealer">;

export const DealerScreen: FC<DealerScreenProps> = ({ route }) => {
    // Use the ID param.
    const id = route.params.id;

    // Get the passed dealer or resolve from state.
    const dealerParam = route.params.dealer;
    const dealerRemote = useAppSelector((state) => (!dealerParam && id ? dealersSelectors.selectById(state, id) : null));
    const dealer = useMemo(() => dealerParam ?? dealerRemote, [dealerParam, dealerRemote]);

    // TODO Shared pattern.
    const top = useSafeAreaInsets()?.top;
    const headerStyle = useMemo(() => ({ paddingTop: 30 + top }), [top]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{dealer?.DisplayName ?? "Viewing event"}</Header>
            <Scroller>{!dealer ? null : <DealerContent dealer={dealer} />}</Scroller>
        </View>
    );
};
