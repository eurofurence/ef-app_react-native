import { useNavigation } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { AreasRouterParamsList } from "../../routes/AreasRouter";
import { IndexRouterParamsList } from "../../routes/IndexRouter";

type AllRoutes = IndexRouterParamsList & AreasRouterParamsList;

type ParamListMap<T> = {
    [RouteName in keyof T]: T;
};

/**
 * Combine all the routes into a single map from Route Name to the ParamsList it maps to
 */
type RouteMap = ParamListMap<AreasRouterParamsList> & ParamListMap<IndexRouterParamsList>;

//This is used for type inference IG
// @ts-expect-error something is off about screens but it does seem to work
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useAppNavigation = <ScreenName extends keyof RouteMap, Screen = RouteMap[ScreenName]>(screen: ScreenName) => useNavigation<StackNavigationProp<Screen, ScreenName>>();

type TypedRoute<RouteName, Params> = {
    params: Params;
    key: string;
    name: RouteName;
    path?: string;
};

// This is used for type inference IG
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useAppRoute = <RouteName extends keyof AllRoutes>(routeName: RouteName): TypedRoute<RouteName, AllRoutes[RouteName]> => useRoute();
