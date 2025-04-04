import * as ImagePicker from 'expo-image-picker'
import * as React from 'react'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useThemeBackground } from '../../../hooks/themes/useThemeHooks'
import { Image, ImageProps } from '../atoms/Image'
import { Label } from '../atoms/Label'
import { Col } from '../containers/Col'

type InnerManagedImagePickerProps<T extends object> = {
    /**
     * The style button.
     */
    style?: ImageProps['style'];

    /**
     * Name of the form field.
     */
    name: keyof T;

    /**
     * Label of the form field.
     */
    label: string;

    /**
     * Translator for error messages by ZOD type.
     * @param type The type of the error.
     */
    errorTranslator?: (name: string, type: string) => string;

    /**
     * Placeholder text.
     */
    placeholder: string;

    /**
     * Image aspect ratio.
     */
    aspectRatio?: number;
};

type ManagedImagePickerProps<T extends object> = InnerManagedImagePickerProps<T>;

export const ManagedImagePicker = <T extends object>({ style, name, label, errorTranslator, placeholder }: ManagedImagePickerProps<T>) => {
    const backgroundStyle = useThemeBackground('background')
    const [aspectRatio, setAspectRatio] = useState<undefined | number>()
    return (
        <Controller
            render={({ field, fieldState }) => (
                // <Banner image={{}}
                <Col>
                    <Label type="caption">{label}</Label>
                    <TouchableOpacity
                        containerStyle={[styles.container, backgroundStyle]}
                        disabled={field.disabled}
                        onPress={() => {
                            ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: false,
                                allowsMultipleSelection: false,
                                quality: 1,
                            }).then((result) => {
                                if (!result.canceled) field.onChange(result.assets[0].uri)
                            })
                        }}
                    >
                        <Image
                            style={[styles.image, field.disabled && styles.disabled, { aspectRatio }, style]}
                            contentFit={undefined}
                            source={field.value}
                            placeholder={null}
                            onLoad={(e) => setAspectRatio(e.source ? e.source.width / e.source.height : undefined)}
                        />
                        {field.value ? null : (
                            <View style={[StyleSheet.absoluteFill, styles.labelContainer]}>
                                <Label>{placeholder}</Label>
                            </View>
                        )}
                    </TouchableOpacity>
                    {fieldState.error && (
                        <Label type="minor" mt={4} color="notification">
                            {errorTranslator ? errorTranslator(field.name, fieldState.error.type) : fieldState.error.message}
                        </Label>
                    )}
                </Col>
            )}
            name={name.toString()}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: undefined,
        marginTop: 6,
        marginBottom: 16,
    },
    disabled: {
        opacity: 0.4,
    },
    image: {
        width: '100%',
        minHeight: 200,
        height: undefined,
    },
    labelContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
})
