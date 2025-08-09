import { FC, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'

import { Icon, IconNames } from '../atoms/Icon'
import { Label } from '../atoms/Label'
import { useThemeBackground, useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { Pressable } from '@/components/generic/Pressable'

/**
 * Arguments to the tab.
 */
export type TabProps = {
  /**
   * Root container style.
   */
  style?: StyleProp<ViewStyle>

  /**
   * True if item is disabled.
   */
  disabled?: boolean

  /**
   * The icon to display.
   */
  icon: IconNames

  /**
   * The name of the tab.
   */
  text: string

  /**
   * True if to be rendered as active.
   */
  active?: boolean

  /**
   * True if on inverted background.
   */
  inverted?: boolean

  /**
   * If true or node, indicator will be presented over the this tab.
   */
  indicate?: boolean | ReactNode

  /**
   * If given, invoked when the tab is pressed.
   */
  onPress?: () => void

  /**
   * Accessibility label for the tab.
   */
  accessibilityLabel?: string

  /**
   * Accessibility hint for the tab.
   */
  accessibilityHint?: string
}

/**
 * Tab is an icon/caption combo intended for use in the bottom-navigation control.
 * @constructor
 */
export const Tab: FC<TabProps> = ({ style, disabled, icon, text, indicate, active = false, inverted = false, onPress, accessibilityLabel, accessibilityHint }) => {
  const { t: a11y } = useTranslation('Accessibility')
  const colorName = inverted ? (active ? 'invImportant' : 'invText') : active ? 'secondary' : 'text'
  const colorValue = useThemeColorValue(colorName)
  const styleBackground = useThemeBackground('notification')

  // Generate accessibility label if not provided
  const computedAccessibilityLabel = accessibilityLabel || text
  const computedAccessibilityHint =
    accessibilityHint || (active ? a11y('tab_active_hint', { defaultValue: 'Currently selected tab' }) : a11y('tab_inactive_hint', { defaultValue: 'Tap to select this tab' }))

  return (
    <Pressable
      containerStyle={[styles.container, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityLabel={computedAccessibilityLabel}
      accessibilityHint={computedAccessibilityHint}
      accessibilityState={{
        selected: active,
        disabled: disabled,
      }}
    >
      <View style={styles.item}>
        <Icon name={icon} size={24} color={colorValue} accessibilityElementsHidden={true} importantForAccessibility="no" />

        {!indicate ? null : (
          <View style={styles.indicatorArea}>
            <View style={styles.indicatorLocator}>
              <View style={[styles.indicatorContent, styleBackground]} accessibilityLabel={a11y('tab_indicator', { defaultValue: 'Has notifications' })} accessibilityRole="text">
                {indicate === true ? null : indicate}
              </View>
            </View>
          </View>
        )}
      </View>
      <View style={styles.item}>
        <Label variant="middle" color={colorName} accessibilityElementsHidden={true} importantForAccessibility="no">
          {text}
        </Label>
      </View>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  item: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  indicatorArea: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  indicatorLocator: {
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContent: {
    position: 'absolute',
    minWidth: 12,
    minHeight: 12,
    padding: 4,
    borderRadius: 99999,
  },
})
