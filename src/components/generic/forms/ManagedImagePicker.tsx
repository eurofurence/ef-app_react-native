import * as ImagePicker from 'expo-image-picker'
import * as React from 'react'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'

import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Image, ImageProps } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import { Col } from '@/components/generic/containers/Col'
import { Pressable } from '@/components/generic/Pressable'

type InnerManagedImagePickerProps<T extends object> = {
  /**
   * The style button.
   */
  style?: ImageProps['style']

  /**
   * Name of the form field.
   */
  name: keyof T

  /**
   * Label of the form field.
   */
  label: string

  /**
   * Translator for error messages by ZOD type.
   * @param type The type of the error.
   */
  errorTranslator?: (name: string, type: string) => string

  /**
   * Placeholder text.
   */
  placeholder: string

  /**
   * Image aspect ratio.
   */
  aspectRatio?: number
}

type ManagedImagePickerProps<T extends object> = InnerManagedImagePickerProps<T>

export const ManagedImagePicker = <T extends object>({ style, name, label, errorTranslator, placeholder }: ManagedImagePickerProps<T>) => {
  const backgroundStyle = useThemeBackground('background')
  const [aspectRatio, setAspectRatio] = useState<undefined | number>()
  return (
    <Controller
      render={({ field, fieldState }) => (
        <Col type="stretch">
          <Label type="caption">{label}</Label>
          <Pressable
            containerStyle={[styles.container, backgroundStyle]}
            disabled={field.disabled}
            onPress={() => {
              ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                allowsMultipleSelection: false,
                quality: 1,
              }).then((result) => {
                if (!result.canceled) field.onChange(result.assets[0].uri)
              })
            }}
          >
            <Image
              style={[field.disabled && styles.disabled, { aspectRatio: aspectRatio ?? 16 / 9 }, style]}
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
          </Pressable>
          <Label type="caption" color="notification" className="mt-1 mb-4">
            {!fieldState.error ? ' ' : errorTranslator ? errorTranslator(field.name, fieldState.error.type) : fieldState.error.message}
          </Label>
        </Col>
      )}
      name={name.toString()}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    height: undefined,
    marginTop: 6,
    marginBottom: 16,
  },
  disabled: {
    opacity: 0.4,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
})
