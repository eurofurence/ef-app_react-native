import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useController, Path, FieldValues } from 'react-hook-form'

import { Label } from '../atoms/Label'
import { ChoiceButtons, ChoiceButtonsProps } from '@/components/generic/atoms/ChoiceButtons'

export type ManagedChoiceButtonsProps<T> = Omit<ChoiceButtonsProps, 'choice' | 'setChoice'> & {
  name: Path<T>
  label?: string
  containerStyle?: StyleProp<ViewStyle>
}

export const ManagedChoiceButtons = <T extends FieldValues = FieldValues>({ name, label, containerStyle, style, ...props }: ManagedChoiceButtonsProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController<T>({
    name,
  })

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Label type="caption" className="mb-2">
          {label}
        </Label>
      )}
      <ChoiceButtons choice={value} setChoice={onChange} style={[styles.input, style]} {...props} />
      {error && (
        <Label type="caption" color="important" className="mt-1">
          {error.message}
        </Label>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    width: '100%',
    paddingVertical: 8,
    fontSize: 16,
  },
})
