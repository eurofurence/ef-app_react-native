import { Label } from './Label'
import { Icon, IconNames } from '@/components/generic/atoms/Icon'
import { useThemeColor, useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { Text } from 'react-native'

export type TabLabelProps = {
  focused: boolean
  icon?: IconNames
  title?: string
  labelStyle?: any
}

export const TabLabel = ({ focused, icon, title, labelStyle }: TabLabelProps) => {
  const iconColor = useThemeColorValue(focused ? 'secondary' : 'text')
  const textColor = useThemeColor(focused ? 'secondary' : 'text')

  const defaultStyle = {
    color: textColor,
    fontSize: 16,
    fontWeight: 'normal',
  }

  const focusedStyle = {
    fontWeight: 'bold',
  }

  if (icon) {
    return (
      <Text style={[defaultStyle, labelStyle, focused && focusedStyle]}>
        <Icon name={icon} color={iconColor} size={20} />
      </Text>
    )
  } else {
    return (
      <Text style={[defaultStyle, labelStyle, focused && focusedStyle]} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
    )
  }
}
