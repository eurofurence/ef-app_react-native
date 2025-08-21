import { useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { appStyles } from '@/components/AppStyles'
import { EventContent } from '@/components/events/EventContent'
import { shareEvent } from '@/components/events/Events.common'
import { platformShareIcon } from '@/components/generic/atoms/Icon'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { NotFoundContent } from '@/components/NotFoundContent'
import { useCache } from '@/context/data/Cache'
import { useUpdateSinceNote } from '@/hooks/data/useUpdateSinceNote'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { useLatchTrue } from '@/hooks/util/useLatchTrue'

export default function EventItem() {
  const { t } = useTranslation('Event')
  const { id } = useLocalSearchParams<{ id: string }>()
  const { events, setValue } = useCache()

  const event = events.dict[id]
  const [announcementMessage, setAnnouncementMessage] = useState('')

  // Focus management for the main content
  const mainContentRef = useAccessibilityFocus<View>(200)

  const handleToggleHidden = useCallback(() => {
    setValue('settings', (current) => ({
      ...current,
      hiddenEvents: current.hiddenEvents?.includes(id) ? current.hiddenEvents.filter((item) => item !== id) : [...(current.hiddenEvents ?? []), id],
    }))
  }, [id, setValue])

  // Get update note. Latch so it's displayed even if reset in background.
  const updated = useUpdateSinceNote(event)
  const showUpdated = useLatchTrue(updated)

  // Announce the event details to screen readers
  useEffect(() => {
    if (event) {
      const message = t('accessibility.event_details_loaded', { title: event.Title })
      setAnnouncementMessage(message)
    }
  }, [event, t])

  return (
    <>
      {/* Status message for screen reader announcement */}
      <StatusMessage message={announcementMessage} type="assertive" visible={false} />

      <ScrollView
        style={StyleSheet.absoluteFill}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        accessibilityLabel={t('accessibility.event_details_scroll')}
        accessibilityHint={t('accessibility.event_details_scroll_hint')}
      >
        <Header
          secondaryIcon={event ? platformShareIcon : undefined}
          secondaryPress={event ? () => shareEvent(event) : undefined}
          accessibilityLabel={t('accessibility.event_header')}
          secondaryAccessibilityLabel={t('Event.share')}
          secondaryAccessibilityHint={t('Event.accessibility.event_header_hint')}
        >
          {event?.Title ?? t('viewing_event')}
        </Header>
        <Floater contentStyle={appStyles.trailer}>
          <View ref={mainContentRef} accessibilityLabel={t('accessibility.event_content')} accessibilityRole="text">
            {!event ? (
              <NotFoundContent accessibilityStatus={t('accessibility.event_not_found')} title={t('event_not_found_title')} message={t('event_not_found_message')} />
            ) : (
              <EventContent event={event} parentPad={padFloater} updated={showUpdated} onToggleHidden={handleToggleHidden} />
            )}
          </View>
        </Floater>
      </ScrollView>
    </>
  )
}
