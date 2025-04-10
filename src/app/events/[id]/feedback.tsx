import React from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { FeedbackForm } from '@/components/feedback/FeedbackForm'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { useCache } from '@/context/data/Cache'

export default function EventFeedback() {
    const { t } = useTranslation('EventFeedback')
    const { eventId } = useLocalSearchParams<{ eventId: string }>()
    const { events } = useCache()
    const event = events.dict[eventId]

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]}>
            <Header>{t('header', { eventTitle: event?.Title, interpolation: { escapeValue: false } })}</Header>
            <Floater>
                <FeedbackForm />
            </Floater>
        </ScrollView>
    )
}
