import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyleProp, TextInputProps, TextStyle, View, TextInput } from "react-native";

import { useTheme } from "../../hooks/useThemeHooks";
import { Label } from "../Atoms/Label";

type InnerManagedTextInputProps<FormType extends object> = {
    name: keyof FormType;
    label: string;
    style?: StyleProp<TextStyle>;
};

type UnunsedTextInputProps<T extends object> = Omit<TextInputProps, keyof InnerManagedTextInputProps<T>>;
type ManagedTextInputProps<T extends object> = InnerManagedTextInputProps<T> & UnunsedTextInputProps<T>;

export const ManagedTextInput = <T extends object>({ name, label, style, ...textInputProps }: ManagedTextInputProps<T>) => {
    const { control } = useFormContext();
    const theme = useTheme();

    const containerStyle = useMemo(
        () => ({
            borderRadius: 16,
            borderBottomColor: theme.invText,
            backgroundColor: theme.background,
            borderBottomWidth: 1,
            padding: 8,
            paddingLeft: 16,
            marginTop: 6,
            marginBottom: 16,
        }),
        [theme],
    );

    const textFieldStyle = useMemo<StyleProp<TextStyle>>(
        () => [
            {
                color: theme.text,
                width: "100%",
                borderBottomColor: theme.invText,
                borderBottomWidth: 1,
            },
            style,
        ],
        [theme],
    );

    return (
        <Controller
            control={control}
            name={name.toString()}
            render={({ field, fieldState }) => (
                <>
                    <Label type={"caption"}>{label}</Label>
                    <View style={containerStyle}>
                        <TextInput {...textInputProps} style={textFieldStyle} placeholderTextColor={theme.soften} {...field} onChangeText={field.onChange} />
                        {fieldState.error && (
                            <Label type={"minor"} color={"warning"}>
                                {fieldState.error.message}
                            </Label>
                        )}
                    </View>
                </>
            )}
        />
    );
};
