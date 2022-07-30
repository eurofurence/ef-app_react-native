import { useNavigation } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { ScreenAreasParamsList } from "../app/ScreenAreas";
import { ScreenStartParamsList } from "../app/ScreenStart";

type AllRoutes = ScreenStartParamsList & ScreenAreasParamsList;

type ParamListMap<T> = {
    [RouteName in keyof T]: T;
};

/**
 * Combine all the routes into a single map from Route Name to the ParamsList it maps to
 */
type RouteMap = ParamListMap<ScreenAreasParamsList> & ParamListMap<ScreenStartParamsList>;

// @ts-expect-error something is off about screens but it does seem to work
export const useAppNavigation = <ScreenName extends keyof RouteMap, Screen = RouteMap[ScreenName]>(screen: ScreenName) => useNavigation<StackNavigationProp<Screen, ScreenName>>();

type TypedRoute<RouteName, Params> = {
    params: Params;
    key: string;
    name: RouteName;
    path?: string;
};

export const useAppRoute = <RouteName extends keyof AllRoutes>(routeName: RouteName): TypedRoute<RouteName, AllRoutes[RouteName]> => useRoute();
