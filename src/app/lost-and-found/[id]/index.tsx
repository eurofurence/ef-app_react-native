import { FC } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { Image } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import { NoData } from '@/components/generic/containers/NoData'
import { useLostAndFoundItemQuery } from '@/hooks/api/lost-and-found/useLostAndFoundItemQuery'
import { useTheme } from '@/hooks/themes/useThemeHooks'

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
        <NoData text={t('loading')} />
      </View>
    )
  }

  if (error || !item) {
    return (
      <View style={styles.container}>
        <NoData text={t('item_not_found')} />
      </View>
    )
  }

  const statusColor = item.Status === 'Found' ? theme.primary : item.Status === 'Returned' ? theme.warning : theme.notification

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {item.ImageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.ImageUrl }} style={styles.image} />
        </View>
      )}

      <View style={styles.header}>
        <Label style={styles.title}>{item.Title}</Label>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Label style={styles.statusText}>{t(`status.${item.Status}`)}</Label>
        </View>
      </View>

      {item.Description && (
        <View style={styles.section}>
          <Label style={styles.sectionTitle}>{t('description')}</Label>
          <Label style={styles.description}>{item.Description}</Label>
        </View>
      )}

      <View style={styles.section}>
        <Label style={styles.sectionTitle}>{t('status')}</Label>
        <Label style={styles.description}>{item.Status}</Label>
        <Label style={styles.date}>{new Date(item.LastChangeDateTimeUtc).toLocaleString()}</Label>
      </View>
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
    marginBottom: 20,
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
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 24,
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
