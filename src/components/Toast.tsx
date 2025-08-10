import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { Easing, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'

import { Icon } from './generic/atoms/Icon'
import { Label } from './generic/atoms/Label'
import { Row } from './generic/containers/Row'
import { ToastMessage, useToastContext } from '@/context/ui/ToastContext'
import { useThemeBackground, useThemeBorder } from '@/hooks/themes/useThemeHooks'
import { Pressable } from '@/components/generic/Pressable'
import { appStyles } from '@/components/AppStyles'

const iconSize = 18 // Matches regular font size.

export type ToastProps = ToastMessage & {
  loose: boolean
}
/**
 * Displays a fading out toast on the tabs.
 * @param id The ID of the toast.
 * @param type The type of the toast.
 * @param content The content. May be a React node.
 * @param queued The queued and unmodified time.
 * @param lifetime The lifetime of this toast.
 * @param loose If false, will render as a box for stacking, otherwise loose/detached.
 * @constructor
 */
export const Toast = ({ id, type, content, queued, lifetime, loose }: ToastProps) => {
  const [seenTime] = useState(Date.now)
  const { t: a11y } = useTranslation('Accessibility')

  const styleColor = useThemeBackground((type === 'error' && 'notification') || (type === 'warning' && 'warning') || (type === 'info' && 'primary') || 'white')
  const iconColor = type === 'notice' ? 'black' : 'white'
  const textColor = type === 'notice' ? 'text' : 'white'
  const iconName = (type === 'error' && 'alert-box') || (type === 'warning' && 'alert') || 'alert-circle'
  const styleBorder = useThemeBorder('darken')
  const opacity = useSharedValue(1)
  const { dismiss } = useToastContext()

  useEffect(() => {
    const remainingTime = lifetime - (seenTime - queued)
    opacity.value = withSequence(
      // Wait.
      withTiming(1, { duration: remainingTime }),
      // Fade out.
      withTiming(0, { duration: 1300, easing: Easing.in(Easing.cubic) })
    )
  }, [seenTime, queued, lifetime, opacity])

  return (
    <Animated.View style={{ opacity }}>
      <Row style={[styleColor, styles.content, loose && styles.loose, styleBorder]}>
        <Icon name={iconName} size={iconSize} color="white" />
        <Label style={styles.text} color={textColor} className="ml-3" type="regular" variant="middle">
          {content}
        </Label>
        <Pressable
          hitSlop={50}
          onPress={() => dismiss(id)}
          style={styles.close}
          accessibilityLabel={a11y('toast_dismiss_button')}
          accessibilityHint={a11y('toast_dismiss_button_hint')}
          accessibilityRole="button"
        >
          <Icon name="close-box-outline" size={iconSize} color={iconColor} />
        </Pressable>
      </Row>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
    overflow: 'hidden',
    borderBottomWidth: 1,
  },
  loose: {
    margin: 10,
    borderRadius: 10,
  },
  text: {
    flex: 1,
  },
  close: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
