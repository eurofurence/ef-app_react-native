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
import { useCache } from '@/context/data/Cache'
import { useUpdateSinceNote } from '@/hooks/data/useUpdateSinceNote'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { useLatchTrue } from '@/hooks/util/useLatchTrue'

export default function EventItem() {
  const { t } = useTranslation('Event')
  const { id } = useLocalSearchParams<{ id: string }>()
  const { events, getValue, setValue } = useCache()

  const event = events.dict[id]
  const [announcementMessage, setAnnouncementMessage] = useState('')

  // Focus management for the main content
  const mainContentRef = useAccessibilityFocus<View>(200)

  const handleToggleHidden = useCallback(() => {
    const settings = getValue('settings')
    const newSettings = {
      ...settings,
      hiddenEvents: settings.hiddenEvents?.includes(id) ? settings.hiddenEvents.filter((item) => item !== id) : [...(settings.hiddenEvents ?? []), id],
    }
    setValue('settings', newSettings)
  }, [id, getValue, setValue])

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
        <Header secondaryIcon={platformShareIcon} secondaryPress={() => event && shareEvent(event)}>
          {event?.Title ?? t('viewing_event')}
        </Header>
        <Floater contentStyle={appStyles.trailer}>
          <View ref={mainContentRef} accessibilityLabel={t('accessibility.event_content')} accessibilityRole="text">
            {!event ? null : <EventContent event={event} parentPad={padFloater} updated={showUpdated} onToggleHidden={handleToggleHidden} />}
          </View>
        </Floater>
      </ScrollView>
    </>
  )
}
