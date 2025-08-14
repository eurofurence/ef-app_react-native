import React, { FC } from 'react'
import { StyleSheet, TextProps, View, ViewProps } from 'react-native'

import { ThemeColor } from '@/context/Theme'
import { useThemeBackground, useThemeColorValue } from '@/hooks/themes/useThemeHooks'

import { Icon, IconNames } from '../atoms/Icon'
import { Label, LabelProps } from '../atoms/Label'

import { Row } from './Row'

const iconSize = 32 // Matches H1 font size.

export type BadgeProps = ViewProps & {
  unpad: number
  badgeColor?: ThemeColor
  textColor: ThemeColor
  textType?: LabelProps['type']
  textVariant?: LabelProps['variant']
  icon?: IconNames
  children: TextProps['children']
}

export const Badge: FC<BadgeProps> = ({ unpad, badgeColor, textColor, textType = 'h3', textVariant = 'middle', icon, children }) => {
  const styleBadgeColor = useThemeBackground(badgeColor ?? 'transparent')
  const styleContainer = { marginHorizontal: -unpad }
  const styleContent = { paddingVertical: 10, paddingHorizontal: unpad }
  const iconColor = useThemeColorValue(textColor)

  return (
    <View style={[styleContainer, styleBadgeColor]}>
      <Row style={[styles.content, styleContent]}>
        {!icon ? null : <Icon name={icon} size={iconSize} color={iconColor} />}
        <Label style={styles.text} color={textColor} className="ml-3" type={textType} variant={textVariant}>
          {children}
        </Label>
      </Row>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 10,
  },
  text: {
    flex: 1,
  },
})
