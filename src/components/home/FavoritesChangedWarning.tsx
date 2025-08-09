import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '../generic/atoms/Label'
import { useFavoritesUpdated } from '@/hooks/data/useFavoritesUpdated'
import { View } from 'react-native'
import { Icon } from '@/components/generic/atoms/Icon'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'

export const FavoritesChangedWarning = () => {
  const { t: tMenu } = useTranslation('Menu')
  const { t } = useTranslation('Home')
  const { t: tAccessibility } = useTranslation('Home', { keyPrefix: 'accessibility' })
  const iconColor = useThemeColorValue('important')
  const { favoriteEvents, favoriteDealers, lastViewTimes, clear } = useFavoritesUpdated()

  const { changedEventFavorite, changedDealerFavorite } = useMemo(() => {
    const changedEvents = favoriteEvents.filter((event) => lastViewTimes && event.Id in lastViewTimes && new Date(event.LastChangeDateTimeUtc) > new Date(lastViewTimes[event.Id]))

    const changedDealers = favoriteDealers.filter(
      (dealer) => lastViewTimes && dealer.Id in lastViewTimes && new Date(dealer.LastChangeDateTimeUtc) > new Date(lastViewTimes[dealer.Id])
    )

    return { changedEventFavorite: changedEvents, changedDealerFavorite: changedDealers }
  }, [favoriteEvents, favoriteDealers, lastViewTimes])

  if (!changedEventFavorite.length && !changedDealerFavorite.length) {
    return null
  }

  return (
    <>
      <View className="pt-8 pb-4 self-stretch" role="alert" accessibilityLabel={tAccessibility('favorites_warning_container')}>
        <View className="self-stretch flex-row items-center">
          <Icon color={iconColor} name="update" size={24} accessibilityLabel={tAccessibility('update_icon')} accessibilityRole="image" />
          <Label className="ml-2 flex-1" type="h2" color="important" ellipsizeMode="tail" accessibilityRole="header">
            {t('warnings.favorites_changed')}
          </Label>
          <Label
            className="leading-8"
            type="compact"
            variant="bold"
            color="secondary"
            onPress={clear}
            accessibilityRole="button"
            accessibilityLabel={tAccessibility('hide_favorites_warning')}
            accessibilityHint={tAccessibility('hide_favorites_warning_hint')}
          >
            {t('warnings.hide')}
          </Label>
        </View>
      </View>

      <Label type="para" accessibilityLabel={tAccessibility('favorites_warning_description')}>
        {t('warnings.favorites_changed_subtitle')}
      </Label>

      {changedEventFavorite.length > 0 && (
        <Label
          className="mt-1"
          accessibilityLabel={tAccessibility('changed_events_list', {
            count: changedEventFavorite.length,
            events: changedEventFavorite.map((event) => event.Title).join(', '),
          })}
        >
          <Label variant="bold">{tMenu('events')}: </Label>
          {changedEventFavorite.map((event) => event.Title).join(', ')}
        </Label>
      )}
      {changedDealerFavorite.length > 0 && (
        <Label
          className="mt-1"
          accessibilityLabel={tAccessibility('changed_dealers_list', {
            count: changedDealerFavorite.length,
            dealers: changedDealerFavorite.map((dealer) => dealer.DisplayNameOrAttendeeNickname).join(', '),
          })}
        >
          <Label variant="bold">{tMenu('dealers')}: </Label>
          {changedDealerFavorite.map((dealer) => dealer.DisplayNameOrAttendeeNickname).join(', ')}
        </Label>
      )}
    </>
  )
}
