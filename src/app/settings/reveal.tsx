import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { EventCard, eventInstanceForAny } from '@/components/events/EventCard'
import { useEventCardInteractions } from '@/components/events/Events.common'
import { Label } from '@/components/generic/atoms/Label'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { useCache } from '@/context/data/Cache'
import { EventDetails } from '@/context/data/types.details'
import { useNow } from '@/hooks/time/useNow'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'

export default function RevealHiddenPage() {
  const { t } = useTranslation('RevealHidden')
  const { events, data, setValue } = useCache()
  const now = useNow(5000) // Update every 5 seconds when focused
  const [announcementMessage, setAnnouncementMessage] = useState<string>('')
  const mainContentRef = useAccessibilityFocus<View>(200)

  // Get all events from cache
  // Filter hidden events and create event instances
  const hiddenEvents = useMemo(() => events.filter((item) => item.Hidden).map((item) => eventInstanceForAny(item, now)), [events, now])

  useEffect(() => {
    if (hiddenEvents.length === 0) {
      setAnnouncementMessage(t('accessibility.no_hidden_events'))
    } else {
      setAnnouncementMessage(t('accessibility.hidden_events_loaded', { count: hiddenEvents.length }))
    }
  }, [hiddenEvents.length, t])

  // Handle unhiding an event
  const onPress = useCallback(
    (event: EventDetails) => {
      setValue('settings', (current) => ({ ...current, hiddenEvents: current.hiddenEvents?.filter((item) => item !== event.Id) }))
    },
    [setValue]
  )
  const { onLongPress } = useEventCardInteractions()

  return (
    <>
      <StatusMessage message={announcementMessage} />
      <ScrollView
        style={StyleSheet.absoluteFill}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        className="flex-1"
        accessibilityLabel={t('accessibility.reveal_hidden_scroll')}
        accessibilityHint={t('accessibility.reveal_hidden_scroll_hint')}
      >
        <Header>{t('header')}</Header>
        <Floater contentStyle={{ marginBottom: 16 }}>
          <View ref={mainContentRef} accessibilityLabel={t('accessibility.reveal_hidden_content')} accessibilityRole="text">
            <Label type="lead" variant="middle" style={{ marginTop: 30 }}>
              {t('lead')}
            </Label>

            {hiddenEvents.map((item) => (
              <EventCard key={item.details.Id} event={item} type="time" onPress={onPress} onLongPress={onLongPress} />
            ))}
          </View>
        </Floater>
      </ScrollView>
    </>
  )
}
