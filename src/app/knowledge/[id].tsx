import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Banner } from '@/components/generic/atoms/Banner'
import { MarkdownContent } from '@/components/generic/atoms/MarkdownContent'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { LinkItem } from '@/components/maps/LinkItem'
import { NotFoundContent } from '@/components/NotFoundContent'
import { useCache } from '@/context/data/Cache'
import { LinkFragment } from '@/context/data/types.api'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'

export default function KnowledgeItem() {
  const { t } = useTranslation('KnowledgeGroups')
  const { id } = useLocalSearchParams<{ id: string }>()
  const { knowledgeEntries } = useCache()

  // Get the knowledge entry from cache
  const entry = knowledgeEntries.dict[id]
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
      <StatusMessage message={announcementMessage} type="assertive" visible={false} />

      <ScrollView
        style={StyleSheet.absoluteFill}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        accessibilityLabel={t('accessibility.kb_entry_scroll')}
        accessibilityHint={t('accessibility.kb_entry_scroll_hint')}
      >
        <Header>{entry?.Title ?? t('viewing_entry')}</Header>
        <Floater>
          {!entry ? (
            <NotFoundContent accessibilityStatus={t('accessibility.kb_entry_not_found')} title={t('kb_entry_not_found_title')} message={t('kb_entry_not_found_message')} />
          ) : (
            <View ref={mainContentRef} accessibilityLabel={t('accessibility.kb_entry_content')} accessibilityRole="text">
              {entry?.Images?.map((image, i) => (
                <View key={i} className="my-2.5">
                  <Banner image={image} viewable />
                </View>
              )) ?? null}
              <MarkdownContent>{entry?.Text ?? ''}</MarkdownContent>
              {entry?.Links?.map((link: LinkFragment) => (
                <View className="mb-5" key={link.Target}>
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
