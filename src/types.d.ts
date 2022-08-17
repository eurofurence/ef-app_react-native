/**
 * A helper type to make RTK Query types more explicit
 */
export type Query<DataType = unknown, ArgsType = unknown> = {
    originalArgs?: ArgsType;
    data?: DataType;
    currentData?: DataType;
    error?: unknown;
    requestId?: string;
    endpointName?: string;
    startedTimeStamp?: number;
    fulfilledTimeStamp?: number;
    refetch: () => void;

    isUninitialized: boolean;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
    isError: boolean;
};

export type CustomRoute<ParamProps extends object, RouteName extends string> = {
    key: string;
    name: RouteName;
    path?: string;
    params: Readonly<ParamProps>;
};

declare module "react-native-easy-markdown" {
    import Markdown from "react-native-easy-markdown";
    export default Markdown;
}
