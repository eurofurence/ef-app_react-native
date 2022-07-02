/**
 * A helper type to make RTK Query types more explicit
 */
type Query<DataType = unknown, ArgsType = unknown> = {
    originalArgs?: ArgsType;
    data?: DataType;
    currentData?: DataType;
    error?: unknown;
    requestId?: string;
    endpointName?: string;
    startedTimeStamp?: number;
    fulfilledTimeStamp?: number;

    isUninitialized: boolean;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
    isError: boolean;
};
