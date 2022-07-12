import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useAppSelector } from "../../store";
import { dealersSelectors } from "../../store/eurofurence.selectors";
import { EventDayRecord } from "../../store/eurofurence.types";
import { ScreenAreasNavigatorParamsList } from "../ScreenAreas";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { DealersListGeneric } from "./DealersListGeneric";

/**
 * Params handled by the screen in route.
 */
export type DealersListAllScreenParams = {
    /**
     * The day that's events are listed.
     */
    day: EventDayRecord;
};

/**
 * The properties to the screen as a component.
 */
export type DealersListAllScreenProps = CompositeScreenProps<TabScreenProps<ScreenAreasNavigatorParamsList, "Dealers">, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const DealersListAllScreen: FC<DealersListAllScreenProps> = ({ navigation }) => {
    // Get the day. Use it to resolve events to display.
    const dealers = useAppSelector(dealersSelectors.selectAll);

    return (
        <DealersListGeneric
            navigation={navigation}
            dealers={dealers}
            leader={
                <View style={{ paddingHorizontal: 30 }}>
                    <Section title={"Dealers at Eurofurence"} subtitle={`${dealers.length} dealers`} />
                </View>
            }
        />
    );
};
