import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Section } from '../generic/atoms/Section'
import { useCurrentEvents } from '@/hooks/data/useCurrentEvents'
import { EventCard } from './EventCard'

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
          />
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
