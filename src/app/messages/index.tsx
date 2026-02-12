import { captureException } from '@sentry/react-native'
import { Redirect, router } from 'expo-router'
import { chain, isEmpty, partition, startCase } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, StyleSheet, View } from 'react-native'

import { Label } from '@/components/generic/atoms/Label'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Header } from '@/components/generic/containers/Header'
import { NoData } from '@/components/generic/containers/NoData'
import { PrivateMessageCard } from '@/components/messages/PrivateMessageCard'
import { useUserContext } from '@/context/auth/User'
import type { CommunicationRecord } from '@/context/data/types.api'
import { useCommunicationsQuery } from '@/hooks/api/communications/useCommunicationsQuery'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'

type Section = {
  title: string
  data: CommunicationRecord[]
}

function keyExtractor({ Id }: CommunicationRecord, index: number) {
  return Id + index
}

function renderItem({ item }: { item: CommunicationRecord }) {
  return (
    <PrivateMessageCard
      key={item.Id}
      containerStyle={styles.item}
      onPress={() =>
        router.push({
          pathname: '/messages/[id]',
          params: { id: item.Id },
        })
      }
      item={item}
    />
  )
}

export default function Messages() {
  const { t } = useTranslation('PrivateMessageList')
  const { t: a11y } = useTranslation('PrivateMessageList')
  const { data: communications, refetch, isPending } = useCommunicationsQuery()
  const { user } = useUserContext()
  const [announcementMessage, setAnnouncementMessage] = useState('')

  // Focus management for the main content
  const mainContentRef = useAccessibilityFocus<View>(200)

  const isAdmin = Boolean(user?.RoleMap?.Admin)
  const isPrivateMessageSender = Boolean(user?.RoleMap?.PrivateMessageSender)

  const sectionedData = useMemo(() => {
    const [unread, read] = partition(
      communications,
      (it: CommunicationRecord) => it.ReadDateTimeUtc === null
    )

    const readSections = chain(read)
      .orderBy(['AuthorName', 'SentDateTimeUtc'], ['asc', 'desc'])
      .groupBy((it: CommunicationRecord) =>
        it.AuthorName
          ? t('from', { author: it.AuthorName?.trim() })
          : t('from_unknown')
      )
      .map((messages, author) => ({
        title: author,
        data: messages,
      }))
      .value()

    const unreadSections = isEmpty(unread)
      ? []
      : [
          {
            title: t('unread'),
            data: unread,
          },
        ]

    return [...unreadSections, ...readSections] as Section[]
  }, [communications, t])

  // Announce messages loaded to screen readers
  useEffect(() => {
    if (communications) {
      const totalMessages = communications.length
      const unreadCount = communications.filter(
        (msg) => msg.ReadDateTimeUtc === null
      ).length

      if (totalMessages === 0) {
        setAnnouncementMessage(a11y('accessibility.no_messages'))
      } else {
        const message = a11y('accessibility.messages_loaded', {
          total: totalMessages,
          unread: unreadCount,
        })
        setAnnouncementMessage(message)
      }
    }
  }, [communications, a11y])

  const sectionStyle = useThemeBackground('background')

  const emptyComponent = useMemo(() => <NoData text={t('no_data')} />, [t])
  const headerComponent = useMemo(() => {
    if (isAdmin || isPrivateMessageSender)
      return (
        <Header
          secondaryIcon='message-plus'
          secondaryPress={() => router.push('messages/compose')}
        >
          {t('header')}
        </Header>
      )
    else return <Header>{t('header')}</Header>
  }, [isAdmin, isPrivateMessageSender, t])

  const renderSection = useCallback(
    ({ section }: { section: Section }) => (
      <Label type='h2' style={[styles.section, sectionStyle]}>
        {startCase(section.title)}
      </Label>
    ),
    [sectionStyle]
  )

  // Eject if not logged in.
  if (!user) return <Redirect href='/' />

  return (
    <>
      {/* Status message for screen reader announcement */}
      <StatusMessage
        message={announcementMessage}
        type='polite'
        visible={false}
      />

      <View
        style={StyleSheet.absoluteFill}
        ref={mainContentRef}
        accessibilityLabel={a11y('accessibility.messages_list')}
        accessibilityHint={a11y('accessibility.messages_list_hint')}
      >
        <SectionList<CommunicationRecord, Section>
          style={StyleSheet.absoluteFill}
          sections={sectionedData}
          contentContainerStyle={styles.container}
          keyExtractor={keyExtractor}
          stickySectionHeadersEnabled
          onRefresh={() => refetch().catch(captureException)}
          refreshing={isPending}
          ListEmptyComponent={emptyComponent}
          ListHeaderComponent={headerComponent}
          renderSectionHeader={renderSection}
          renderItem={renderItem}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
  },
  item: {
    paddingHorizontal: 20,
  },
  container: {
    paddingBottom: 100,
  },
})
