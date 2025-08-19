import { useTranslation } from 'react-i18next'
import { StyleSheet, ViewProps } from 'react-native'

import { Icon } from '@/components/generic/atoms/Icon'
import { Pressable } from '@/components/generic/Pressable'
import { useCurrentUser } from '@/context/auth/User'
import { useCache } from '@/context/data/Cache'
import { useThemeBackground, useThemeColorValue } from '@/hooks/themes/useThemeHooks'

export function ShowInternalEventsToggle({ style, ...props }: ViewProps) {
  const { t } = useTranslation('Events')

  const toggleBackground = useThemeBackground('inverted')
  const iconColor = useThemeColorValue('staff')

  const user = useCurrentUser()
  const isStaff = Boolean(user?.RoleMap?.Staff)

  const { data, setValue } = useCache()
  const showInternal = data.settings.showInternalEvents ?? true

  if (!isStaff) return null
  return (
    <Pressable
      onPress={() => setValue('settings', { ...data.settings, showInternalEvents: !showInternal })}
      accessibilityRole="button"
      accessibilityLabel={showInternal ? t('hide_internal_events', { defaultValue: 'Hide internal events' }) : t('show_internal_events', { defaultValue: 'Show internal events' })}
      accessibilityHint={t('toggle_internal_events', { defaultValue: 'Toggle internal events filter' })}
      style={[styles.toggle, toggleBackground, style]}
      {...props}
    >
      <Icon name={showInternal ? 'briefcase-variant-outline' : 'briefcase-variant-off-outline'} size={22} color={iconColor} />
    </Pressable>
  )
}
const styles = StyleSheet.create({
  toggle: {
    height: 44,
    width: 44,
    marginLeft: 6,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  toggleDisabled: {
    opacity: 0.4,
  },
})
