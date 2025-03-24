import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { useController, Path } from "react-hook-form";

import { Label } from "../atoms/Label";
import { useThemeColorValue } from "@/hooks/themes/useThemeHooks";

export type ManagedTextInputProps<T> = TextInputProps & {
    name: Path<T>;
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
};

export const ManagedTextInput = <T extends Record<string, any>>({ 
    name, 
    label, 
    containerStyle,
    style,
    ...props 
}: ManagedTextInputProps<T>) => {
    const { field: { value, onChange, onBlur }, fieldState: { error } } = useController<T>({
        name,
    });

    const textColor = useThemeColorValue("text");

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Label type="caption" mb={8}>{label}</Label>}
            <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[styles.input, { color: textColor }, style]}
                placeholderTextColor={textColor + "80"}
                {...props}
            />
            {error && <Label type="caption" color="important" mt={4}>{error.message}</Label>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    input: {
        width: "100%",
        borderBottomColor: "black",
        borderBottomWidth: 1,
        paddingVertical: 8,
        fontSize: 16,
    },
}); 