import { FC } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Continuous } from "./Continuous";
import { useSynchronizer } from "../../sync/SynchronizationProvider";

/**
 * Props for the activity indicator.
 */
export type ActivityProps = {
    /**
     * Style passed to root.
     */
    style?: StyleProp<ViewStyle>;
};

export const Activity: FC<ActivityProps> = ({ style }) => {
    const { isSynchronizing } = useSynchronizer();

    // Indicate on the context's state.
    return <Continuous style={style} active={isSynchronizing} />;
};
