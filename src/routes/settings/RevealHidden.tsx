import { useIsFocused } from '@react-navigation/core'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { appStyles } from '@/components/AppStyles'
import { EventCard, eventInstanceForAny } from '@/components/events/EventCard'
import { Label } from '@/components/generic/atoms/Label'
import { Floater } from '@/components/generic/containers/Floater'
import { useNow } from '@/hooks/time/useNow'
import { useCache } from '@/context/data/Cache'

export const RevealHidden = () => {
  const { t } = useTranslation('RevealHidden')
  const isFocused = useIsFocused()
  const now = useNow(isFocused ? 5 : 'static')
  const { events, getValue, setValue } = useCache()

  const settings = getValue('settings')

  const projected = useMemo(() => events.filter((item) => Boolean(settings.hiddenEvents?.includes(item.Id))), [events, settings.hiddenEvents])
  const instances = useMemo(() => projected.map((details) => eventInstanceForAny(details, now)), [projected, now])

  const unhideEvent = (eventId: string) => {
    setValue('settings', {
      ...settings,
      hiddenEvents: settings.hiddenEvents?.filter((id) => id !== eventId) ?? [],
    })
  }

  return (
    <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
      <Floater contentStyle={appStyles.trailer}>
        <Label type="lead" variant="middle" mt={30}>
          {t('lead')}
        </Label>

        {instances.map((item) => (
          <EventCard key={item.details.Id} event={item} type="time" onPress={() => unhideEvent(item.details.Id)} />
        ))}
      </Floater>
    </ScrollView>
  )
}
