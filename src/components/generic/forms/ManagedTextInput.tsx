import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyleProp, TextInputProps, TextStyle, View, TextInput } from "react-native";

import { useTheme } from "../../../hooks/themes/useThemeHooks";
import { Label } from "../atoms/Label";

type InnerManagedTextInputProps<FormType extends object> = {
    name: keyof FormType;
    label: string;
    style?: StyleProp<TextStyle>;
    errorTranslator?: (name: string, type: string) => string;
};

type UnunsedTextInputProps<T extends object> = Omit<TextInputProps, keyof InnerManagedTextInputProps<T>>;
type ManagedTextInputProps<T extends object> = InnerManagedTextInputProps<T> & UnunsedTextInputProps<T>;

export const ManagedTextInput = <T extends object>({ name, label, style, errorTranslator, ...textInputProps }: ManagedTextInputProps<T>) => {
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
                    <Label type="caption">{label}</Label>
                    <View style={containerStyle}>
                        <TextInput
                            {...textInputProps}
                            ref={field.ref}
                            style={[textFieldStyle, field.disabled && { opacity: 0.5 }]}
                            placeholderTextColor={theme.soften}
                            onBlur={field.onBlur}
                            onChangeText={field.onChange}
                            value={field.value}
                        />
                        {fieldState.error && (
                            <Label type="minor" mt={4} color="notification">
                                {errorTranslator ? errorTranslator(field.name, fieldState.error.type) : fieldState.error.message}
                            </Label>
                        )}
                    </View>
                </>
            )}
        />
    );
};
