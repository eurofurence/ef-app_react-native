import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native'
import { useController, Path } from 'react-hook-form'

import { Label } from '../atoms/Label'
import { useTheme } from '@/hooks/themes/useThemeHooks'
import { useMemo } from 'react'

export type ManagedTextInputProps<T> = TextInputProps & {
  name: Path<T>
  label?: string
  containerStyle?: StyleProp<ViewStyle>
  errorTranslator?: (name: string, type: string) => string
}

export const ManagedTextInput = <T extends Record<string, any>>({ name, label, containerStyle, errorTranslator, style, ...props }: ManagedTextInputProps<T>) => {
  const {
    field: { name: fieldName, value, onChange, onBlur },
    fieldState: { error },
  } = useController<T>({
    name,
  })

  const theme = useTheme()
  const inputStyle = useMemo(
    () => ({
      color: theme.text,
      borderBottomColor: theme.soften,
    }),
    [theme]
  )

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Label type="caption">{label}</Label>}
      <TextInput value={value} onChangeText={onChange} onBlur={onBlur} style={[styles.input, inputStyle, style]} placeholderTextColor={theme.text + '80'} {...props} />
      <Label type="caption" color="notification" className="mt-1 mb-4">
        {!error ? ' ' : errorTranslator ? errorTranslator(fieldName, error.type) : error.message}
      </Label>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
})
