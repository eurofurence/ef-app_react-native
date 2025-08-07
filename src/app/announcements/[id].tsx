import { format, parseISO } from 'date-fns'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { appStyles } from '@/components/AppStyles'
import { Banner } from '@/components/generic/atoms/Banner'
import { Label } from '@/components/generic/atoms/Label'
import { MarkdownContent } from '@/components/generic/atoms/MarkdownContent'
import { Rule } from '@/components/generic/atoms/Rule'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { Row } from '@/components/generic/containers/Row'
import { useCache } from '@/context/data/Cache'

export default function AnnounceItem() {
  const { t } = useTranslation('Announcement')
  const { id } = useLocalSearchParams<{ id: string }>()
  const { announcements } = useCache()
  const announcement = announcements.dict[id]

  return (
    <ScrollView
      style={StyleSheet.absoluteFill}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll
      accessibilityLabel={t('accessibility.scroll_view')}
      accessibilityHint={t('accessibility.scroll_view_hint')}
      accessibilityRole="scrollbar"
    >
      <Header>{t('header')}</Header>
      <Floater contentStyle={appStyles.trailer}>
        {!announcement ? (
          <Label type="h2" className="mt-8 mb-3" accessibilityLabel={t('accessibility.not_available_message')} accessibilityRole="alert">
            {t('not_available')}
          </Label>
        ) : (
          <>
            <Label type="h1" className="mt-8 mb-3" accessibilityLabel={t('accessibility.title_heading')} accessibilityRole="header">
              {announcement.NormalizedTitle}
            </Label>

            <Row style={styles.byline} variant="spaced" accessibilityLabel={t('accessibility.byline_info')}>
              <Label
                accessibilityLabel={t('accessibility.date_info', {
                  date: format(parseISO(announcement.ValidFromDateTimeUtc), 'PPpp'),
                })}
              >
                {format(parseISO(announcement.ValidFromDateTimeUtc), 'PPpp')}
              </Label>

              <Label
                style={styles.tag}
                ellipsizeMode="head"
                numberOfLines={1}
                accessibilityLabel={t('accessibility.area_author_info', {
                  area: announcement.Area,
                  author: announcement.Author,
                })}
              >
                {announcement.Area} - {announcement.Author}
              </Label>
            </Row>
            <Rule style={styles.rule} />

            {!announcement.Image ? null : (
              <View style={styles.posterLine} accessibilityLabel={t('accessibility.banner_image')}>
                <Banner image={announcement.Image} viewable />
              </View>
            )}

            <MarkdownContent>{announcement.Content}</MarkdownContent>
          </>
        )}
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
