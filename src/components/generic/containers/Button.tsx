import * as React from 'react'
import { FC, ReactElement, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Icon, IconNames } from '../atoms/Icon'
import { Label, LabelProps } from '../atoms/Label'
import { useThemeBackground, useThemeBorder, useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { Pressable } from '@/components/generic/Pressable'

export const buttonIconSize = 20
const pad = 8
const border = 2

/**
 * Arguments to the button.
 */
export type ButtonProps = {
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  className?: string;
  labelType?: LabelProps['type']
  labelVariant?: LabelProps['variant']

  /**
   * True if outline button instead of filled button.
   */
  outline?: boolean

  /**
   * If given, displayed as the button's icon.
   */
  icon?: IconNames | ReactElement | ((props: { size: number; color: string }) => ReactNode)

  /**
   * If given, displayed as the button's icon, this is displayed on the right side.
   */
  iconRight?: IconNames | ReactElement | ((props: { size: number; color: string }) => ReactNode)

  /**
   * The text of the button.
   */
  children?: ReactNode

  /**
   * If given, invoked on button press.
   */
  onPress?: () => void

  /**
   * If given, invoked on long press.
   */
  onLongPress?: () => void

  /**
   * If true, button is disabled.
   */
  disabled?: boolean
}

export const Button: FC<ButtonProps> = ({ containerStyle, style, className, labelType, labelVariant, outline, icon, iconRight, children, onPress, onLongPress, disabled }) => {
  // Computed styles.
  const baseStyle = outline ? styles.containerOutline : styles.containerFill
  const disabledStyle = disabled ? styles.disabled : null
  const borderStyle = useThemeBorder('inverted')
  const fillStyle = useThemeBackground(outline ? 'transparent' : 'inverted')
  const color = useThemeColorValue(outline ? 'important' : 'invImportant')

  let iconComponent
  if (!icon) iconComponent = <View style={styles.placeholder} />
  else if (typeof icon === 'string') iconComponent = <Icon name={icon} size={buttonIconSize} color={color} />
  else if (icon instanceof Function) iconComponent = icon({ size: buttonIconSize, color })
  else iconComponent = icon

  let iconRightComponent
  if (!iconRight) iconRightComponent = <View style={styles.placeholder} />
  else if (typeof iconRight === 'string') iconRightComponent = <Icon name={iconRight} size={buttonIconSize} color={color} />
  else if (iconRight instanceof Function) iconRightComponent = iconRight({ size: buttonIconSize, color })
  else iconRightComponent = iconRight

  return (
    <Pressable
      containerStyle={containerStyle}
      style={[styles.container, baseStyle, fillStyle, outline && borderStyle, disabledStyle, style]}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      className={className}
    >
      {iconComponent}

      <Label type={labelType} variant={labelVariant} style={styles.text} color={outline ? 'important' : 'invImportant'}>
        {children}
      </Label>

      {iconRightComponent}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerFill: {
    padding: pad,
    backgroundColor: 'black',
  },
  containerOutline: {
    padding: pad - border,
    borderColor: 'black',
    borderWidth: border,
  },
  disabled: {
    opacity: 0.5,
  },
  placeholder: {
    width: buttonIconSize,
    height: buttonIconSize,
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 22,
  },
  outlineText: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})
