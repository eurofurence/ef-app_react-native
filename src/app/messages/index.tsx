import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, StyleSheet } from 'react-native'
import { chain, isEmpty, partition, startCase } from 'lodash'
import { router } from 'expo-router'

import { Label } from '@/components/generic/atoms/Label'
import { Header } from '@/components/generic/containers/Header'
import { PrivateMessageCard } from '@/components/messages/PrivateMessageCard'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { NoData } from '@/components/generic/containers/NoData'
import { CommunicationRecord } from '@/context/data/types.api'
import { useAuthData } from '@/context/auth/AuthData'
import { captureException } from '@sentry/react-native'

type Section = {
  title: string
  data: CommunicationRecord[]
}

export default function Messages() {
  const { t } = useTranslation('PrivateMessageList')
  const { communications, refresh, isRefreshing } = useAuthData()

  const navigateTo = useCallback(
    (item: CommunicationRecord) =>
      router.push({
        pathname: '/messages/[messageId]',
        params: { messageId: item.Id },
      }),
    []
  )

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

  const keyExtractor = useCallback(({ Id }: CommunicationRecord, index: number) => Id + index, [])
  const emptyComponent = useMemo(() => <NoData text={t('no_data')} />, [t])
  const headerComponent = useMemo(() => <Header>{t('header')}</Header>, [t])

  const renderSection = useCallback(
    ({ section }: { section: Section }) => (
      <Label type="h2" style={[styles.section, sectionStyle]}>
        {startCase(section.title)}
      </Label>
    ),
    [sectionStyle]
  )

  const renderItem = useCallback(
    ({ item }: { item: CommunicationRecord }) => <PrivateMessageCard key={item.Id} containerStyle={styles.item} onPress={() => navigateTo(item)} item={item} />,
    [navigateTo]
  )

  const backgroundStyle = useThemeBackground('background')

  return (
    <SectionList<CommunicationRecord, Section>
      style={[StyleSheet.absoluteFill, backgroundStyle]}
      sections={sectionedData}
      contentContainerStyle={styles.container}
      keyExtractor={keyExtractor}
      stickySectionHeadersEnabled
      onRefresh={() => refresh().catch(captureException)}
      refreshing={isRefreshing}
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
  action: {
    flex: 3,
  },
  item: {
    paddingHorizontal: 20,
  },
  container: {
    paddingBottom: 100,
  },
})
