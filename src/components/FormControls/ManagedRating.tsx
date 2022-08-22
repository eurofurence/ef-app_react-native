import { Controller } from "react-hook-form";
import { StyleProp, ViewStyle } from "react-native";
import StarRating from "react-native-star-rating-widget";

import { Label } from "../Atoms/Label";
import { Col } from "../Containers/Col";

type InnerManagedRatingProps<T extends object> = {
    name: keyof T;
    label: string;
};
type StarRatingProps = {
    minRating?: number;
    color?: string;
    emptyColor?: string;
    maxStars?: number;
    starSize?: number;
    enableHalfStar?: boolean;
    enableSwiping?: boolean;
    style?: StyleProp<ViewStyle>;
    starStyle?: StyleProp<ViewStyle>;
    testID?: string;
};
type ManagedRatingProps<T extends object> = InnerManagedRatingProps<T> & StarRatingProps;

export const ManagedRating = <T extends object>({ name, label, ...ratingProps }: ManagedRatingProps<T>) => {
    return (
        <Controller
            render={({ field, fieldState }) => (
                <Col type={"stretch"}>
                    <Label variant={"bold"} mt={16}>
                        {label}
                    </Label>
                    <StarRating rating={field.value} onChange={field.onChange} {...ratingProps} />
                    {fieldState.error && (
                        <Label type={"minor"} color={"warning"}>
                            {fieldState.error?.message}
                        </Label>
                    )}
                </Col>
            )}
            name={name.toString()}
        />
    );
};
