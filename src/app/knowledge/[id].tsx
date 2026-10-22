import { eq, useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { appStyles } from '@/components/AppStyles'
import { Banner } from '@/components/generic/atoms/Banner'
import { platformShareIcon } from '@/components/generic/atoms/Icon'
import { MarkdownContent } from '@/components/generic/atoms/MarkdownContent'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { shareKbEntry } from '@/components/kb/KbEntry.common'
import { LoadingContent } from '@/components/LoadingContent'
import { LinkItem } from '@/components/maps/LinkItem'
import { NotFoundContent } from '@/components/NotFoundContent'
import { imagesCollection } from '@/data/collections/content/Images'
import { kbEntriesCollection } from '@/data/collections/content/KbEntries'
import type { EfId } from '@/data/types/EfId'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'

function KnowledgeItemImage({ imageId }: { imageId: EfId }) {
  const { data: image } = useLiveQuery(
    {
      id: `knowledge-item-image-${imageId}`,
      query: (q) =>
        q
          .from({ item: imagesCollection })
          .where(({ item }) => eq(item.Id, imageId))
          .findOne(),
    },
    [imageId]
  )

  return image ? (
    <View className='my-2.5'>
      <Banner image={image} viewable />
    </View>
  ) : null
}

const leadingHeading = /^\s*#{1,6}\s/

export default function KnowledgeItem() {
  const { t } = useTranslation('KnowledgeGroups')
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: entry, isLoading: pending } = useLiveQuery(
    {
      id: 'knowledge-item',
      query: (q) =>
        q
          .from({ item: kbEntriesCollection })
          .where(({ item }) => eq(item.Id, id))
          .findOne(),
    },
    [id]
  )

  // Get the knowledge entry from cache
  const entry = knowledgeEntries.dict[id]
  const pending = !entry && isSynchronizing

  const leadsWithHeading =
    !entry?.Images?.length && leadingHeading.test(entry?.Text ?? '')
  const [announcementMessage, setAnnouncementMessage] = useState('')

  // Focus management for the main content
  const mainContentRef = useAccessibilityFocus<View>(200)

  // Announce the knowledge entry to screen readers
  useEffect(() => {
    if (entry) {
      const message = t('accessibility.kb_entry_loaded', { title: entry.Title })
      setAnnouncementMessage(message)
    }
  }, [entry, t])

  return (
    <>
      {/* Status message for screen reader announcement */}
      <StatusMessage
        message={announcementMessage}
        type='assertive'
        visible={false}
      />

      <ScrollView
        style={StyleSheet.absoluteFill}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        accessibilityLabel={t('accessibility.kb_entry_scroll')}
        accessibilityHint={t('accessibility.kb_entry_scroll_hint')}
      >
        <Header
          secondaryIcon={entry ? platformShareIcon : undefined}
          secondaryPress={entry ? () => shareKbEntry(entry) : undefined}
          secondaryAccessibilityLabel={t('share')}
          secondaryAccessibilityHint={t('accessibility.kb_entry_header_hint')}
        >
          {entry?.Title ?? t('viewing_entry')}
        </Header>
        <Floater contentStyle={appStyles.trailer}>
          {pending ? (
            <LoadingContent message={t('loading')} />
          ) : !entry ? (
            <NotFoundContent
              accessibilityStatus={t('accessibility.kb_entry_not_found')}
              title={t('kb_entry_not_found_title')}
              message={t('kb_entry_not_found_message')}
            />
          ) : (
            <View
              ref={mainContentRef}
              className={leadsWithHeading ? '' : 'mt-5'}
              accessibilityLabel={t('accessibility.kb_entry_content')}
              accessibilityRole='text'
            >
              {entry?.ImageIds?.map((imageId) => (
                <KnowledgeItemImage key={imageId} imageId={imageId} />
              )) ?? null}
              <MarkdownContent>{entry?.Text ?? ''}</MarkdownContent>
              {entry?.Links?.map((link) => (
                <View className='mb-5' key={link.Target}>
                  <LinkItem link={link} />
                </View>
              ))}
            </View>
          )}
        </Floater>
      </ScrollView>
    </>
  )
}
