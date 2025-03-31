import { StyleSheet } from "react-native";
import { ReactNode } from "react";
import { Label } from "./Label";

export const tabLabelMaxWidth = 110;

export type TabLabelProps = {
    focused: boolean;
    children?: ReactNode | undefined;
};

export const TabLabel = ({ focused, children }: TabLabelProps) => {
    return (
        <Label type="bold" style={[focused ? styles.focused : styles.unfocused]} numberOfLines={1} ellipsizeMode="tail">
            {children}
        </Label>
    );
};

const styles = StyleSheet.create({
    unfocused: {
        maxWidth: tabLabelMaxWidth,
        opacity: 0.5,
    },
    focused: {
        maxWidth: tabLabelMaxWidth,
        opacity: 1,
    },
});
