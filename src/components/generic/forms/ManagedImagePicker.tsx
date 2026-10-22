import { captureException } from '@sentry/react-native'
import {
  ImageManipulator,
  type ImageManipulatorContext,
  type ImageRef,
  SaveFormat,
} from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import { useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'

import { Image, type ImageProps } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import { Col } from '@/components/generic/containers/Col'
import { Pressable } from '@/components/generic/Pressable'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

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

export const ManagedImagePicker = <T extends object>({
  style,
  name,
  label,
  errorTranslator,
  placeholder,
}: ManagedImagePickerProps<T>) => {
  const backgroundStyle = useThemeBackground('background')
  const { setError } = useFormContext()
  const [aspectRatio, setAspectRatio] = useState<undefined | number>()
  const [picking, setPicking] = useState(false)
  const pickGeneration = useRef(0)
  return (
    <Controller
      render={({ field, fieldState }) => (
        <Col type='stretch'>
          <Label type='caption'>{label}</Label>
          <Pressable
            containerStyle={[styles.container, backgroundStyle]}
            disabled={field.disabled || picking}
            onPress={async () => {
              // Disabling is not enough: taps within one frame both start before
              // the re-render, so only the newest run may touch the field.
              const generation = ++pickGeneration.current
              const isCurrent = () => generation === pickGeneration.current
              setPicking(true)
              try {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ['images'],
                  allowsEditing: false,
                  allowsMultipleSelection: false,
                  quality: 1,
                })
                if (result.canceled) return

                // iOS and web hand back the picked file untouched, so HEIC/TIFF/AVIF
                // reach the API in a format its resizer cannot decode. Re-encode here.
                let context: ImageManipulatorContext | undefined
                let image: ImageRef | undefined
                try {
                  context = ImageManipulator.manipulate(result.assets[0].uri)
                  image = await context.renderAsync()
                  const jpeg = await image.saveAsync({
                    format: SaveFormat.JPEG,
                  })
                  if (isCurrent()) field.onChange(jpeg.uri)
                } catch (error) {
                  captureException(error)
                  if (isCurrent())
                    setError(field.name, { type: 'unsupported_image' })
                } finally {
                  context?.release()
                  image?.release()
                }
              } finally {
                if (isCurrent()) setPicking(false)
              }
            }}
          >
            <Image
              style={[
                field.disabled && styles.disabled,
                { aspectRatio: aspectRatio ?? 16 / 9 },
                style,
              ]}
              contentFit={undefined}
              source={field.value}
              placeholder={null}
              onLoad={(e) =>
                setAspectRatio(
                  e.source ? e.source.width / e.source.height : undefined
                )
              }
            />
            {field.value ? null : (
              <View style={[StyleSheet.absoluteFill, styles.labelContainer]}>
                <Label>{placeholder}</Label>
              </View>
            )}
          </Pressable>
          <Label type='caption' color='notification' className='mt-1 mb-3'>
            {!fieldState.error
              ? ' '
              : errorTranslator
                ? errorTranslator(field.name, fieldState.error.type)
                : fieldState.error.message}
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
