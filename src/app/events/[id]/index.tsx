import React, { useCallback } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { appStyles } from '@/components/AppStyles'
import { EventContent } from '@/components/events/EventContent'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { useUpdateSinceNote } from '@/hooks/data/useUpdateSinceNote'
import { useLatchTrue } from '@/hooks/util/useLatchTrue'
import { platformShareIcon } from '@/components/generic/atoms/Icon'
import { shareEvent } from '@/components/events/Events.common'
import { useCache } from '@/context/data/Cache'

export default function EventItem() {
  const { t } = useTranslation('Event')
  const { id } = useLocalSearchParams<{ id: string }>()
  const { events, getValue, setValue } = useCache()

  const event = events.dict[id]

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

  return (
    <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
      <Header secondaryIcon={platformShareIcon} secondaryPress={() => event && shareEvent(event)}>
        {event?.Title ?? t('viewing_event')}
      </Header>
      <Floater contentStyle={appStyles.trailer}>
        {!event ? null : <EventContent event={event} parentPad={padFloater} updated={showUpdated} onToggleHidden={handleToggleHidden} />}
      </Floater>
    </ScrollView>
  )
}
