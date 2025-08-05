import React, { useCallback, useMemo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/generic/atoms/Label'
import { Floater } from '@/components/generic/containers/Floater'
import { EventCard, eventInstanceForAny } from '@/components/events/EventCard'
import { useNow } from '@/hooks/time/useNow'
import { useCache } from '@/context/data/Cache'
import { Header } from '@/components/generic/containers/Header'
import { useEventLongPress } from '@/hooks/data/useEventReminder'

// Component for individual event card with long press functionality
const HiddenEventCard = ({ item, onUnhide }: { item: any; onUnhide: (id: string) => void }) => {
  const { onLongPress } = useEventLongPress(item.details)

  return <EventCard key={item.details.Id} event={item} type="time" onPress={() => onUnhide(item.details.Id)} onLongPress={onLongPress} />
}

export default function RevealHiddenPage() {
  const { t } = useTranslation('RevealHidden')
  const { events, getValue, setValue } = useCache()
  const now = useNow(5000) // Update every 5 seconds when focused

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
      <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll className="flex-1">
        <Header>{t('header')}</Header>
        <Floater contentStyle={{ marginBottom: 16 }}>
          <Label type="lead" variant="middle" style={{ marginTop: 30 }}>
            {t('lead')}
          </Label>

          {hiddenEvents.map((item) => (
            <HiddenEventCard key={item.details.Id} item={item} onUnhide={handleUnhide} />
          ))}
        </Floater>
      </ScrollView>
    </>
  )
}
