import { FC } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useIsLoading } from "../../context/LoadingContext";
import { Continuous } from "./Loading/Continuous";

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
    // Use the context's loading state. See LoadingContext.
    const isLoading = useIsLoading();

    // Indicate on the context's state.
    return <Continuous style={style} active={isLoading} />;
};
