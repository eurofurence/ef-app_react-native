import {EventCard2} from "@/components/events/EventCard2";
import {eventsFullCollection} from "@/data/collections/content/EventsFull";
import {hiddenEventsToggle} from "@/data/collections/supplemental/HiddenEvents";
import {not, isUndefined, useLiveQuery} from "@tanstack/react-db";
import {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Label } from '@/components/generic/atoms/Label'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'

export default function RevealHiddenPage() {
  const { t } = useTranslation('RevealHidden')
  const {data: events} = useLiveQuery({
    id: 'settings-reveal',
    query: q => q.from({item: eventsFullCollection})
      .where(({item}) => not(isUndefined(item.Hidden)))
      .orderBy(({item}) => item.StartDateTimeUtc)
  })

  const [announcementMessage, setAnnouncementMessage] = useState<string>('')
  const mainContentRef = useAccessibilityFocus<View>(200)

  useEffect(() => {
    if (events.length === 0) {
      setAnnouncementMessage(t('accessibility.no_hidden_events'))
    } else {
      setAnnouncementMessage(
        t('accessibility.hidden_events_loaded', {count: events.length})
      )
    }
  }, [events.length, t])

  return (
    <>
      <StatusMessage message={announcementMessage} />
      <ScrollView
        style={StyleSheet.absoluteFill}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        className='flex-1'
        accessibilityLabel={t('accessibility.reveal_hidden_scroll')}
        accessibilityHint={t('accessibility.reveal_hidden_scroll_hint')}
      >
        <Header>{t('header')}</Header>
        <Floater contentStyle={{ marginBottom: 16 }}>
          <View
            ref={mainContentRef}
            accessibilityLabel={t('accessibility.reveal_hidden_content')}
            accessibilityRole='text'
          >
            <Label type='lead' variant='middle' style={{ marginTop: 30 }}>
              {t('lead')}
            </Label>

            {events.map((item) => (
              <EventCard2
                key={item.Id}
                event={item}
                type='time'
                onPress={() => hiddenEventsToggle(item.Id)}
              />
            ))}
          </View>
        </Floater>
      </ScrollView>
    </>
  )
}
