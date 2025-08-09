import { FC } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { Image } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import { NoData } from '@/components/generic/containers/NoData'
import { useTheme } from '@/hooks/themes/useThemeHooks'
import { useLostAndFoundItemQuery } from '@/hooks/api/lost-and-found/useLostAndFoundQuery'
import { Header } from '@/components/generic/containers/Header'
import { Floater } from '@/components/generic/containers/Floater'

export default function LostAndFoundDetailPage() {
  return <LostAndFoundDetailContent />
}

const LostAndFoundDetailContent: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { t } = useTranslation('LostAndFound')
  const theme = useTheme()
  const { data: item, isLoading, error } = useLostAndFoundItemQuery(id)

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header>{t('header')}</Header>
        <NoData text={t('loading')} />
      </View>
    )
  }

  if (error || !item) {
    return (
      <View style={styles.container}>
        <Header>{t('header')}</Header>
        <NoData text={t('item_not_found')} />
      </View>
    )
  }

  const statusColor = item.Status === 'Found' ? theme.primary : item.Status === 'Returned' ? theme.warning : theme.notification

  return (
    <ScrollView
      style={StyleSheet.absoluteFill}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll
      accessibilityLabel={t('accessibility.detail_page_scroll_view', { title: item.Title })}
      accessibilityHint={t('accessibility.detail_page_scroll_view_hint')}
    >
      <Header>{item.Title}</Header>

      <Floater>
        {item.ImageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.ImageUrl }}
              style={styles.image}
              accessibilityLabel={t('accessibility.item_image', { title: item.Title })}
              accessibilityHint={t('accessibility.item_image_hint')}
            />
          </View>
        )}

        <View style={styles.header}>
          <Label style={styles.title} accessibilityRole="header" accessibilityLabel={t('accessibility.item_title', { title: item.Title })}>
            {item.Title}
          </Label>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor }]}
            accessibilityLabel={t('accessibility.status_badge', { status: t(`status.${item.Status}`) })}
            accessibilityRole="text"
          >
            <Label style={styles.statusText}>{t(`status.${item.Status}`)}</Label>
          </View>
        </View>

        {item.Description && (
          <View style={styles.section} accessibilityLabel={t('accessibility.description_section')}>
            <Label style={styles.sectionTitle} accessibilityRole="header">
              {t('description')}
            </Label>
            <Label style={styles.description} accessibilityLabel={t('accessibility.item_description', { description: item.Description })}>
              {item.Description}
            </Label>
          </View>
        )}

        <View style={styles.section} accessibilityLabel={t('accessibility.date_section')}>
          <Label style={styles.date} accessibilityLabel={t('accessibility.reported_date', { date: new Date(item.LastChangeDateTimeUtc).toLocaleString() })}>
            {new Date(item.LastChangeDateTimeUtc).toLocaleString()}
          </Label>
        </View>
      </Floater>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 20,
  },
  title: {
    flex: 1,
    fontSize: 24,
    paddingTop: 12,
    fontWeight: 'bold',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  location: {
    fontSize: 16,
  },
  category: {
    fontSize: 16,
  },
  contactInfo: {
    fontSize: 16,
  },
  reportedBy: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
})
