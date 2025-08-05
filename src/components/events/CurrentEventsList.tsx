import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Section } from '../generic/atoms/Section'
import { useCurrentEvents } from '@/hooks/data/useCurrentEvents'
import { useEventLongPress } from '@/hooks/data/useEventReminder'
import { EventCard } from './EventCard'

// Component for individual event card with long press functionality
const CurrentEventCard = ({ event }: { event: any }) => {
  const { onLongPress } = useEventLongPress(event.details)

  return (
    <EventCard
      key={event.details.Id}
      event={event}
      type="duration"
      onPress={(event) =>
        router.navigate({
          pathname: '/events/[id]',
          params: { id: event.Id },
        })
      }
      onLongPress={onLongPress}
    />
  )
}

export type CurrentEventListProps = {
  now: Date
}

export const CurrentEventList: FC<CurrentEventListProps> = ({ now }) => {
  const { t } = useTranslation('Events')
  const events = useCurrentEvents(now)

  if (events.length === 0) {
    return null
  }

  return (
    <>
      <Section title={t('current_title')} subtitle={t('current_subtitle')} icon="clock" />
      <View style={styles.condense}>
        {events.map((event) => (
          <CurrentEventCard key={event.details.Id} event={event} />
        ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  condense: {
    marginVertical: -15,
  },
})
