import { Label } from './Label'
import { Icon, IconNames } from '@/components/generic/atoms/Icon'
import { useThemeColor, useThemeColorValue } from '@/hooks/themes/useThemeHooks'

export type TabLabelProps = {
  focused: boolean
  icon?: IconNames
  title?: string
}

export const TabLabel = ({ focused, icon, title }: TabLabelProps) => {
  const iconColor = useThemeColorValue(focused ? 'secondary' : 'text')
  const textColor = useThemeColor(focused ? 'secondary' : 'text')

  if (icon) {
    return <Icon name={icon} color={iconColor} size={20} />
  } else {
    return (
      <Label type="bold" style={textColor} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Label>
    )
  }
}
