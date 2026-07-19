import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Icon } from '@/components/generic/atoms/Icon'
import { lastViewTimesClear } from '@/data/collections/supplemental/LastViewTimes'
import { useFavoritesUpdated } from '@/hooks/data/useFavoritesUpdated'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'

import { Label } from '../generic/atoms/Label'

export const FavoritesChangedWarning = () => {
  const { t: tMenu } = useTranslation('Menu')
  const { t } = useTranslation('Home')
  const { t: tAccessibility } = useTranslation('Home', {
    keyPrefix: 'accessibility',
  })
  const iconColor = useThemeColorValue('important')
  const { events, dealers } = useFavoritesUpdated()

  if (!events.length && !dealers.length) {
    return null
  }

  return (
    <>
      <View
        className='pt-8 pb-4 self-stretch'
        role='alert'
        accessibilityLabel={tAccessibility('favorites_warning_container')}
      >
        <View className='self-stretch flex-row items-center'>
          <Icon
            color={iconColor}
            name='update'
            size={24}
            accessibilityLabel={tAccessibility('update_icon')}
            accessibilityRole='image'
          />
          <Label
            className='ml-2 flex-1'
            type='h2'
            color='important'
            ellipsizeMode='tail'
            accessibilityRole='header'
          >
            {t('warnings.favorites_changed')}
          </Label>
          <Label
            className='leading-8'
            type='compact'
            variant='bold'
            color='secondary'
            onPress={lastViewTimesClear}
            accessibilityRole='button'
            accessibilityLabel={tAccessibility('hide_favorites_warning')}
            accessibilityHint={tAccessibility('hide_favorites_warning_hint')}
          >
            {t('warnings.hide')}
          </Label>
        </View>
      </View>

      <Label
        type='para'
        accessibilityLabel={tAccessibility('favorites_warning_description')}
      >
        {t('warnings.favorites_changed_subtitle')}
      </Label>

      {events.length > 0 && (
        <Label
          className='mt-1'
          accessibilityLabel={tAccessibility('changed_events_list', {
            count: events.length,
            events: events.map((event) => event.Title).join(', '),
          })}
        >
          <Label variant='bold'>{tMenu('events')}: </Label>
          {events.map((event) => event.Title).join(', ')}
        </Label>
      )}
      {dealers.length > 0 && (
        <Label
          className='mt-1'
          accessibilityLabel={tAccessibility('changed_dealers_list', {
            count: dealers.length,
            dealers: dealers
              .map((dealer) => dealer.DisplayNameOrAttendeeNickname)
              .join(', '),
          })}
        >
          <Label variant='bold'>{tMenu('dealers')}: </Label>
          {dealers
            .map((dealer) => dealer.DisplayNameOrAttendeeNickname)
            .join(', ')}
        </Label>
      )}
    </>
  )
}
