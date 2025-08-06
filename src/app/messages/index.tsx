import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, StyleSheet } from 'react-native'
import { chain, isEmpty, partition, startCase } from 'lodash'
import { Redirect, router } from 'expo-router'

import { Label } from '@/components/generic/atoms/Label'
import { Header } from '@/components/generic/containers/Header'
import { PrivateMessageCard } from '@/components/messages/PrivateMessageCard'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { NoData } from '@/components/generic/containers/NoData'
import { CommunicationRecord } from '@/context/data/types.api'
import { captureException } from '@sentry/react-native'
import { useCommunicationsQuery } from '@/hooks/api/communications/useCommunicationsQuery'
import { useUserContext } from '@/context/auth/User'

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
  const { data: communications, refetch, isPending } = useCommunicationsQuery()
  const { user } = useUserContext()

  const isAdmin = Boolean(user?.RoleMap?.Admin)
  const isPrivateMessageSender = Boolean(user?.RoleMap?.PrivateMessageSender)

  const sectionedData = useMemo(() => {
    const [unread, read] = partition(communications, (it: CommunicationRecord) => it.ReadDateTimeUtc === null)

    const readSections = chain(read)
      .orderBy(['AuthorName', 'SentDateTimeUtc'], ['asc', 'desc'])
      .groupBy((it: CommunicationRecord) => (it.AuthorName ? t('from', { author: it.AuthorName?.trim() }) : t('from_unknown')))
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

  const sectionStyle = useThemeBackground('background')

  const emptyComponent = useMemo(() => <NoData text={t('no_data')} />, [t])
  const headerComponent = useMemo(() => {
    if (isAdmin || isPrivateMessageSender)
      return (
        <Header secondaryIcon="message-plus" secondaryPress={() => router.push('messages/compose')}>
          {t('header')}
        </Header>
      )
    else return <Header>{t('header')}</Header>
  }, [isAdmin, isPrivateMessageSender, t])

  const renderSection = useCallback(
    ({ section }: { section: Section }) => (
      <Label type="h2" style={[styles.section, sectionStyle]}>
        {startCase(section.title)}
      </Label>
    ),
    [sectionStyle]
  )

  // Eject if not logged in.
  if (!user) return <Redirect href="/" />

  return (
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
