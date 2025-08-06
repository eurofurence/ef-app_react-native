import React, { useEffect } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { parseISO, format } from 'date-fns'
import { useLocalSearchParams, router, Redirect } from 'expo-router'

import { appStyles } from '@/components/AppStyles'
import { MarkdownContent } from '@/components/generic/atoms/MarkdownContent'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { Label } from '@/components/generic/atoms/Label'
import { Row } from '@/components/generic/containers/Row'
import { Rule } from '@/components/generic/atoms/Rule'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useCommunicationsMarkReadMutation } from '@/hooks/api/communications/useCommunicationsMarkReadMutation'

import { useCommunicationsItemQuery } from '@/hooks/api/communications/useCommunicationsQuery'

const readOpenTimeRequirement = 1500

export default function MessageItem() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { t } = useTranslation('PrivateMessageItem')
  const { data: message } = useCommunicationsItemQuery(id)
  const { mutate } = useCommunicationsMarkReadMutation()
  const backgroundStyle = useThemeBackground('background')

  // Mark as read after delay
  useEffect(() => {
    if (!message || message.ReadDateTimeUtc !== null) return

    const handle = setTimeout(() => {
      mutate(message.Id)
    }, readOpenTimeRequirement)

    return () => clearTimeout(handle)
  }, [message, mutate])

  // Navigate back if the message not found
  useEffect(() => {
    if (!message) {
      router.back()
    }
  }, [message])

  if (!message) return <Redirect href="/messages" />

  const formattedDate = message.ReceivedDateTimeUtc ? format(parseISO(message.ReceivedDateTimeUtc), 'PPpp') : ''

  return (
    <ScrollView style={[StyleSheet.absoluteFill, backgroundStyle]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
      <Header>{message.AuthorName}</Header>
      <Floater contentStyle={appStyles.trailer}>
        <Label type="h1" className="mt-8 mb-3">
          {message.Subject}
        </Label>

        <Row style={styles.byline} variant="spaced">
          <Label>
            <Label>{formattedDate}</Label>
          </Label>

          <Label style={styles.tag} ellipsizeMode="head" numberOfLines={1}>
            {t('from', { authorName: message.AuthorName })}
          </Label>
        </Row>
        <Rule style={styles.rule} />

        <MarkdownContent>{message.Message}</MarkdownContent>
      </Floater>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  byline: {
    marginTop: 10,
  },
  rule: {
    marginTop: 10,
    marginBottom: 30,
  },
  tag: {
    textAlign: 'right',
  },
  posterLine: {
    marginBottom: 20,
    alignItems: 'center',
  },
})
