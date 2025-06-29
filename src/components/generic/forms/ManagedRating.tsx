import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useController, Path } from 'react-hook-form'
import StarRating from 'react-native-star-rating-widget'

import { Label } from '../atoms/Label'

export type ManagedRatingProps<T> = {
  name: Path<T>
  label?: string
  minRating?: number
  enableHalfStar?: boolean
  color?: string
  style?: StyleProp<ViewStyle>
  starSize?: number
}

export const ManagedRating = <T extends Record<string, any>>({ name, label, enableHalfStar = false, color = '#FFD700', style, starSize = 32 }: ManagedRatingProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController<T>({
    name,
  })

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Label type="caption" mb={8}>
          {label}
        </Label>
      )}
      <StarRating rating={value ?? 0} onChange={onChange} enableHalfStar={enableHalfStar} starSize={starSize} color={color} />
      {error && (
        <Label type="caption" color="important" mt={4}>
          {error.message}
        </Label>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
})
