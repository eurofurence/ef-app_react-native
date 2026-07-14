import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Icon } from '@/components/generic/atoms/Icon'
import { useAuthState } from '@/data/clients/auth'
import { useWarningState } from '@/hooks/data/useWarningState'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'

import { Label } from '../generic/atoms/Label'

export const CalendarSyncWarning = () => {
  const { t } = useTranslation('Home', { keyPrefix: 'warnings' })
  const { t: tAccessibility } = useTranslation('Home', {
    keyPrefix: 'accessibility',
  })
  const iconColor = useThemeColorValue('important')
  const { isLoggedIn } = useAuthState()
  const { isHidden, hideWarning } = useWarningState('calendarSyncHidden')

  if (!isLoggedIn || isHidden) {
    return null
  }

  return (
    <>
      <View
        className='pt-8 pb-4 self-stretch'
        role='alert'
        accessibilityLabel={tAccessibility('calendar_warning_container')}
      >
        <View className='self-stretch flex-row items-center'>
          <Icon
            color={iconColor}
            name='calendar-sync'
            size={24}
            accessibilityLabel={tAccessibility('warning_icon')}
            accessibilityRole='image'
          />
          <Label
            className='ml-2 flex-1'
            type='h2'
            color='important'
            ellipsizeMode='tail'
            accessibilityRole='header'
          >
            {t('calendar_sync')}
          </Label>
          <Label
            className='leading-8'
            type='compact'
            variant='bold'
            color='secondary'
            onPress={hideWarning}
            accessibilityRole='button'
            accessibilityLabel={tAccessibility('hide_calendar_warning')}
            accessibilityHint={tAccessibility('hide_calendar_warning_hint')}
          >
            {t('hide')}
          </Label>
        </View>
      </View>

      <Label
        type='para'
        onPress={() => router.navigate('/settings')}
        accessibilityRole='button'
        accessibilityLabel={tAccessibility('view_calendar_settings')}
        accessibilityHint={tAccessibility('view_calendar_settings_hint')}
      >
        {t('calendar_sync_subtitle')}
      </Label>
    </>
  )
}
