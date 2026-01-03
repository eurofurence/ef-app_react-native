import type { FC, PropsWithChildren } from 'react'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

export const padFloater = 20

/**
 * Props to the Floater.
 */
export type FloaterProps = PropsWithChildren<{
  /**
   * Style of the container view.
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Style of the content view.
   */
  contentStyle?: StyleProp<ViewStyle>
}>

/**
 * A scrolling content with a child that has a maximum width.
 * @constructor
 */
export const Floater: FC<FloaterProps> = ({
  containerStyle,
  contentStyle,
  children,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.arranger}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: padFloater,
  },
  arranger: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    maxWidth: 600,
  },
})
