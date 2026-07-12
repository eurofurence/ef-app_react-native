import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Icon } from '@/components/generic/atoms/Icon'
import { useAuthState } from '@/data/clients/auth'
import { useUserDatamatrix } from '@/hooks/api/users/useUserDatamatrix'
import { useWarningState } from '@/hooks/data/useWarningState'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'

import { Label } from '../generic/atoms/Label'

export const BadgeAvailableWarning = () => {
  const { t } = useTranslation('Home', { keyPrefix: 'warnings' })
  const { t: tAccessibility } = useTranslation('Home', {
    keyPrefix: 'accessibility',
  })
  const iconColor = useThemeColorValue('important')
  const { isLoggedIn } = useAuthState()
  const { data: datamatrix } = useUserDatamatrix()
  const { isHidden, hideWarning } = useWarningState('badgeAvailableHidden')

  if (!isLoggedIn || !datamatrix || isHidden) {
    return null
  }

  return (
    <>
      <View
        className='pt-8 pb-4 self-stretch'
        role='alert'
        accessibilityLabel={tAccessibility('badge_warning_container')}
      >
        <View className='self-stretch flex-row items-center'>
          <Icon
            color={iconColor}
            name='barcode-scan'
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
            {t('badge_available')}
          </Label>
          <Label
            className='leading-8'
            type='compact'
            variant='bold'
            color='secondary'
            onPress={hideWarning}
            accessibilityRole='button'
            accessibilityLabel={tAccessibility('hide_badge_warning')}
            accessibilityHint={tAccessibility('hide_badge_warning_hint')}
          >
            {t('hide')}
          </Label>
        </View>
      </View>

      <Label
        type='para'
        onPress={() => router.navigate('/profile')}
        accessibilityRole='button'
        accessibilityLabel={tAccessibility('view_badge')}
        accessibilityHint={tAccessibility('view_badge_hint')}
      >
        {t('badge_available_subtitle')}
      </Label>
    </>
  )
}
