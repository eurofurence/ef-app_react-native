import { format } from 'date-fns'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { appStyles } from '@/components/AppStyles'
import { Label } from '@/components/generic/atoms/Label'
import { MarkdownContent } from '@/components/generic/atoms/MarkdownContent'
import { Rule } from '@/components/generic/atoms/Rule'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { Row } from '@/components/generic/containers/Row'
import { useCommunicationsMarkReadMutation } from '@/hooks/api/communications/useCommunicationsMarkReadMutation'
import { useCommunicationsItemQuery } from '@/hooks/api/communications/useCommunicationsQuery'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { parseDefaultISO } from '@/util/parseDefaultISO'

const readOpenTimeRequirement = 1500

export default function MessageItem() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { t } = useTranslation('PrivateMessageItem')
  const { t: a11y } = useTranslation('PrivateMessageItem')
  const { data: message } = useCommunicationsItemQuery(id)
  const { mutate } = useCommunicationsMarkReadMutation()
  const backgroundStyle = useThemeBackground('background')
  const [announcementMessage, setAnnouncementMessage] = useState('')

  // Focus management for the main content
  const mainContentRef = useAccessibilityFocus<View>(200)

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

  // Announce message loaded to screen readers
  useEffect(() => {
    if (message) {
      const messageText = a11y('accessibility.message_loaded', {
        subject: message.Subject,
        author: message.AuthorName,
      })
      setAnnouncementMessage(messageText)
    }
  }, [message, a11y])

  if (!message) return <Redirect href="/messages" />

  const formattedDate = message.ReceivedDateTimeUtc ? format(parseDefaultISO(message.ReceivedDateTimeUtc), 'PPpp') : ''

  return (
    <>
      {/* Status message for screen reader announcement */}
      <StatusMessage message={announcementMessage} type="assertive" visible={false} />

      <ScrollView
        style={[StyleSheet.absoluteFill, backgroundStyle]}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        accessibilityLabel={a11y('accessibility.message_scroll')}
        accessibilityHint={a11y('accessibility.message_scroll_hint')}
      >
        <Header>{message.AuthorName}</Header>
        <Floater contentStyle={appStyles.trailer}>
          <View ref={mainContentRef} accessibilityLabel={a11y('accessibility.message_content')} accessibilityRole="text">
            <Label type="h1" className="mt-8 mb-3">
              {message.Subject}
            </Label>

            <Row style={styles.byline} variant="spaced">
              <Label>{formattedDate}</Label>
              <Label style={styles.tag} ellipsizeMode="head" numberOfLines={1}>
                {t('from', { authorName: message.AuthorName })}
              </Label>
            </Row>
            <Rule style={styles.rule} />

            <MarkdownContent>{message.Message}</MarkdownContent>
          </View>
        </Floater>
      </ScrollView>
    </>
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
