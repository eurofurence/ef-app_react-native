import { FC } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useSynchronizer } from "../../sync/SynchronizationProvider";
import { Continuous } from "./Continuous";

/**
 * Props for the activity indicator.
 */
export type ActivityProps = {
    /**
     * Style passed to root.
     */
    style?: StyleProp<ViewStyle>;
};

/**
 * @deprecated Not much use, sync time shorter than show.
 */
export const Activity: FC<ActivityProps> = ({ style }) => {
    const { isSynchronizing } = useSynchronizer();

    // Indicate on the context's state.
    return <Continuous style={style} active={isSynchronizing} />;
};
