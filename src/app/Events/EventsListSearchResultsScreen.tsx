import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, useCallback, useContext } from "react";
import { View } from "react-native";

import { Button } from "../../components/Containers/Button";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsListGeneric } from "./EventsListGeneric";
import { EventsSearchContext } from "./EventsSearchContext";
import { EventsTabsScreenNavigatorParamsList } from "./EventsTabsScreen";

/**
 * Params handled by the screen in route.
 */
export type EventsListSearchResultsScreenParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type EventsListSearchResultsScreenProps = CompositeScreenProps<PagesScreenProps<EventsTabsScreenNavigatorParamsList, any>, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const EventsListSearchResultsScreen: FC<EventsListSearchResultsScreenProps> = ({ navigation }) => {
    const { setSearch, results } = useContext(EventsSearchContext);

    const onClear = useCallback(() => {
        setSearch("");
        navigation.jumpTo("Search");
    }, [setSearch, navigation]);

    return (
        <EventsListGeneric
            navigation={navigation}
            events={results ?? []}
            leader={
                <View style={{ padding: 30 }}>
                    <Button icon="remove-circle" onPress={onClear}>
                        Clear search
                    </Button>
                </View>
            }
        />
    );
};
