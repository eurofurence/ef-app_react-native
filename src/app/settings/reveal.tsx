import React, { useCallback, useMemo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/generic/atoms/Label'
import { Floater } from '@/components/generic/containers/Floater'
import { EventCard, eventInstanceForAny } from '@/components/events/EventCard'
import { useNow } from '@/hooks/time/useNow'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useCache } from '@/context/data/Cache'

export default function RevealHiddenPage() {
  const { t } = useTranslation('RevealHidden')
  const { events, getValue, setValue } = useCache()
  const now = useNow(5000) // Update every 5 seconds when focused
  const backgroundStyle = useThemeBackground('background')

  // Get all events from cache
  // Filter hidden events and create event instances
  const hiddenEvents = useMemo(() => events.filter((item) => item.Hidden).map((item) => eventInstanceForAny(item, now)), [events, now])

  // Handle unhiding an event
  const handleUnhide = useCallback(
    (eventId: string) => {
      const settings = getValue('settings')
      const newSettings = {
        ...settings,
        hiddenEvents: settings.hiddenEvents?.filter((item) => item !== eventId),
      }
      setValue('settings', newSettings)
    },
    [getValue, setValue]
  )

  return (
    <>
      <ScrollView style={[StyleSheet.absoluteFill, backgroundStyle]} className="flex-1">
        <Floater contentStyle={{ marginBottom: 16 }}>
          <Label type="lead" variant="middle" style={{ marginTop: 30 }}>
            {t('lead')}
          </Label>

          {hiddenEvents.map((item) => (
            <EventCard key={item.details.Id} event={item} type="time" onPress={() => handleUnhide(item.details.Id)} />
          ))}
        </Floater>
      </ScrollView>
    </>
  )
}
