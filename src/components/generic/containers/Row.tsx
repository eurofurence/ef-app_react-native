import { FC } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

/**
 * Arguments to the row.
 */
export type RowProps = ViewProps & {
  /**
   * The type, one of some predefined primary style values.
   */
  type?: keyof typeof types

  /**
   * The variant, one of some predefined secondary style values, overriding type.
   */
  variant?: keyof typeof variants

  /**
   * If given, adds flex gap to the styles.
   */
  gap?: number
}

export const Row: FC<RowProps> = ({ style, type, variant, gap, children, ...rest }) => {
  // Resolve styles.
  const resType = type ? types[type] : types.regular
  const resVariant = variant ? variants[variant] : variants.start
  return (
    <View style={[resType, resVariant, typeof gap === 'number' && { gap }, style]} {...rest}>
      {children}
    </View>
  )
}

const types = StyleSheet.create({
  regular: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  start: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stretch: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
})

const variants = StyleSheet.create({
  wrap: {
    flexWrap: 'wrap',
  },
  start: {
    justifyContent: 'flex-start',
  },
  end: {
    justifyContent: 'flex-end',
  },
  spaced: {
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
  },
})
