import { Controller, useFormContext } from "react-hook-form";
import { StyleProp, TextInputProps, TextStyle, View, TextInput, StyleSheet } from "react-native";

import { useTheme, useThemeMemo } from "../../../hooks/themes/useThemeHooks";
import { Label, labelTypeStyles } from "../atoms/Label";

type InnerManagedTextInputProps<FormType extends object> = {
    name: keyof FormType;
    label: string;
    style?: StyleProp<TextStyle>;
};

type UnusedTextInputProps<T extends object> = Omit<TextInputProps, keyof InnerManagedTextInputProps<T>>;
type ManagedTextInputProps<T extends object> = InnerManagedTextInputProps<T> & UnusedTextInputProps<T>;

export const ManagedTextInput = <T extends object>({ name, label, style, ...textInputProps }: ManagedTextInputProps<T>) => {
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
                            style={[textThemeStyle, styles.text, labelTypeStyles.regular, style]}
                            placeholderTextColor={theme.soften}
                            {...field}
                            onChangeText={field.onChange}
                        />
                        {fieldState.error && (
                            <Label type="minor" color="warning">
                                {fieldState.error.message}
                            </Label>
                        )}
                    </View>
                </>
            )}
        />
    );
};

const styles = StyleSheet.create({
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
