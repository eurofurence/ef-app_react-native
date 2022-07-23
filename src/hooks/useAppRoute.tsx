import { useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers/src/types";

import { ScreenAreasParamsList } from "../app/ScreenAreas";
import { ScreenStartParamsList } from "../app/ScreenStart";

type ParamListMap<T extends ParamListBase> = {
    [RouteName in keyof T]: T[RouteName];
};

/**
 * Combine all the routes into a single map from Route Name to the ParamsList it maps to
 */
type RouteMap = ParamListMap<ScreenAreasParamsList> & ParamListMap<ScreenStartParamsList>;
type RouteKeys = keyof RouteMap;

type TEst = RouteMap["Home"];

// @ts-expect-error
export const useAppRoute = <RouteName extends RouteKeys, RouteParamsList = RouteMap[RouteName]>(routeName: RouteName) => useRoute<RouteProp<RouteParamsList, RouteName>>();
