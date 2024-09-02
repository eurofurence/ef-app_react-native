import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, StyleProp, TextInputProps, TextStyle, View, TextInput } from "react-native";

import { useTheme, useThemeMemo } from "../../../hooks/themes/useThemeHooks";
import { Label, labelTypeStyles } from "../atoms/Label";

type InnerManagedTextInputProps<FormType extends object> = {
    name: keyof FormType;
    label: string;
    style?: StyleProp<TextStyle>;
    errorTranslator?: (name: string, type: string) => string;
};

type UnusedTextInputProps<T extends object> = Omit<TextInputProps, keyof InnerManagedTextInputProps<T>>;
type ManagedTextInputProps<T extends object> = InnerManagedTextInputProps<T> & UnusedTextInputProps<T>;

export const ManagedTextInput = <T extends object>({ name, label, style, errorTranslator, ...textInputProps }: ManagedTextInputProps<T>) => {
    const { control } = useFormContext();
    const theme = useTheme();

    const containerThemeStyle = useThemeMemo((theme) => ({ borderBottomColor: theme.invText, backgroundColor: theme.background }));
    const textThemeStyle = useThemeMemo((theme) => ({ color: theme.text, borderBottomColor: theme.invText }));

    return (
        <Controller
            control={control}
            name={name.toString()}
            render={({ field, fieldState }) => (
                <>
                    <Label type="caption">{label}</Label>
                    <View style={[containerThemeStyle, styles.container]}>
                        <TextInput
                            {...textInputProps}
                            ref={field.ref}
                            style={[textThemeStyle, field.disabled && styles.disabled, styles.text, labelTypeStyles.regular, style]}
                            placeholderTextColor={theme.soften}
                            onBlur={field.onBlur}
                            onChangeText={field.onChange}
                            readOnly={field.disabled}
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

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.4,
    },
    container: {
        borderRadius: 16,
        borderBottomWidth: 1,
        padding: 8,
        paddingLeft: 16,
        marginTop: 6,
        marginBottom: 16,
    },
    text: {
        width: "100%",
        borderBottomWidth: 1,
    },
});
