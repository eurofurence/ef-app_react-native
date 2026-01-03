import { type Path, useController } from 'react-hook-form'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'
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
  step?: 'half' | 'quarter' | 'full'
}

export const ManagedRating = <T extends Record<string, any>>({
  name,
  label,
  enableHalfStar = false,
  color = '#FFD700',
  style,
  starSize = 32,
  step,
}: ManagedRatingProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController<T>({
    name,
  })

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Label type='caption' className='mb-2'>
          {label}
        </Label>
      )}
      <StarRating
        rating={value ?? 0}
        onChange={onChange}
        step={step ?? (enableHalfStar ? 'half' : 'full')}
        starSize={starSize}
        color={color}
      />
      {error && (
        <Label type='caption' color='important' className='mt-1'>
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
