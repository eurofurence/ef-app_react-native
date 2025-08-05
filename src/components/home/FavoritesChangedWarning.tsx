import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '../generic/atoms/Label'
import { Section } from '../generic/atoms/Section'
import { useFavoritesState } from '@/hooks/data/useFavoritesState'

export const FavoritesChangedWarning = () => {
  const { t: tMenu } = useTranslation('Menu')
  const { t } = useTranslation('Home')
  const { favoriteEvents, favoriteDealers, lastViewTimes } = useFavoritesState()

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
      <Section title={t('warnings.favorites_changed')} subtitle={t('warnings.favorites_changed_subtitle')} icon="update" />

      {changedEventFavorite.length > 0 && (
        <Label className="mt-1">
          <Label variant="bold">{tMenu('events')}: </Label>
          {changedEventFavorite.map((event) => event.Title).join(', ')}
        </Label>
      )}
      {changedDealerFavorite.length > 0 && (
        <Label className="mt-1">
          <Label variant="bold">{tMenu('dealers')}: </Label>
          {changedDealerFavorite.map((dealer) => dealer.DisplayNameOrAttendeeNickname).join(', ')}
        </Label>
      )}
    </>
  )
}
