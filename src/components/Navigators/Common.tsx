import { EventEmitter, TabActions } from "@react-navigation/core";
import { ParamListBase } from "@react-navigation/native";
import { Route } from "@react-navigation/routers/src/types";

import { PagesNavigationEventMap, PagesNavigationProp } from "./PagesNavigator";
import { TabNavigationEventMap, TabNavigationProp } from "./TabsNavigator";

export function navigateTab<ParamList extends ParamListBase, RouteName extends keyof ParamList>(
    navigation: (PagesNavigationProp<ParamList> & EventEmitter<PagesNavigationEventMap>) | (TabNavigationProp<ParamList> & EventEmitter<TabNavigationEventMap>),
    nameOrIndex: number | Route<Extract<RouteName, string>, ParamList[RouteName]>
) {
    const state = navigation.getState();
    const target = typeof nameOrIndex === "number" ? state.routes[nameOrIndex] : nameOrIndex;

    const event = navigation.emit({
        type: "tabPress",
        target: target.key,
        canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
        navigation.dispatch({
            ...TabActions.jumpTo(target.name),
            target: state.key,
        });
    }
}
