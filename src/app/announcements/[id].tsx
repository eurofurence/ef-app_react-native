import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { format, parseISO } from 'date-fns'

import { appStyles } from '@/components/AppStyles'
import { Banner } from '@/components/generic/atoms/Banner'
import { Label } from '@/components/generic/atoms/Label'
import { MarkdownContent } from '@/components/generic/atoms/MarkdownContent'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { Row } from '@/components/generic/containers/Row'
import { Rule } from '@/components/generic/atoms/Rule'
import { useCache } from '@/context/data/Cache'

export default function AnnounceItem() {
  const { t } = useTranslation('Announcement')
  const { id } = useLocalSearchParams<{ id: string }>()
  const { announcements } = useCache()
  const announcement = announcements.dict[id]

  return (
    <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
      <Header>{t('header')}</Header>
      <Floater contentStyle={appStyles.trailer}>
        {!announcement ? null : (
          <>
            <Label type="h1" mt={30} mb={10}>
              {announcement.NormalizedTitle}
            </Label>

            <Row style={styles.byline} variant="spaced">
              <Label>{format(parseISO(announcement.ValidFromDateTimeUtc), 'PPpp')}</Label>

              <Label style={styles.tag} ellipsizeMode="head" numberOfLines={1}>
                {announcement.Area} - {announcement.Author}
              </Label>
            </Row>
            <Rule style={styles.rule} />

            {!announcement.Image ? null : (
              <View style={styles.posterLine}>
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
