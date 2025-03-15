import { StyleSheet } from "react-native";
import { Label } from "./Label";

export const tabLabelMaxWidth = 110;

export type TabLabelProps = {
    focused: boolean;
    children: string;
    wide: boolean;
};

export const TabLabel = ({ focused, children, wide }: TabLabelProps) => {
    return (
        <Label type="bold" style={[focused ? styles.focused : styles.unfocused, wide && styles.wide]} numberOfLines={1} ellipsizeMode="tail">
            {children}
        </Label>
    );
};

const styles = StyleSheet.create({
    wide: {
        maxWidth: tabLabelMaxWidth,
        paddingHorizontal: 5,
    },
    unfocused: {
        maxWidth: tabLabelMaxWidth,
        opacity: 0.5,
    },
    focused: {
        maxWidth: tabLabelMaxWidth,
        opacity: 1,
    },
});
