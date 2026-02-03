import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Image } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import { Card } from '@/components/generic/containers/Card'
import type { LostAndFoundRecord } from '@/context/data/types.api'
import { useTheme } from '@/hooks/themes/useThemeHooks'

export type LostAndFoundCardProps = {
  item: LostAndFoundRecord
  onPress?: () => void
  containerStyle?: any
}

export const LostAndFoundCard: FC<LostAndFoundCardProps> = ({
  item,
  onPress,
  containerStyle,
}) => {
  const theme = useTheme()
  const { t } = useTranslation('LostAndFound')

  const statusColor =
    item.Status === 'Found'
      ? theme.primary
      : item.Status === 'Returned'
        ? theme.warning
        : theme.notification

  return (
    <View style={containerStyle}>
      <Card
        onPress={onPress}
        accessibilityRole='button'
        accessibilityLabel={t('accessibility.lost_found_card', {
          title: item.Title,
          status: t(`status.${item.Status}`),
          date: new Date(item.LastChangeDateTimeUtc).toLocaleDateString(),
        })}
        accessibilityHint={t('accessibility.lost_found_card_hint')}
      >
        <View style={styles.container}>
          {item.ImageUrl && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.ImageUrl }}
                style={styles.image}
                accessibilityLabel={t('accessibility.item_image', {
                  title: item.Title,
                })}
              />
            </View>
          )}
          <View style={styles.content}>
            <View style={styles.header}>
              <Label
                style={styles.title}
                numberOfLines={2}
                accessibilityRole='header'
              >
                {item.Title}
              </Label>
              <View
                style={[styles.statusBadge, { backgroundColor: statusColor }]}
                accessibilityLabel={t('accessibility.status_badge', {
                  status: t(`status.${item.Status}`),
                })}
                accessibilityRole='text'
              >
                <Label style={styles.statusText}>
                  {t(`status.${item.Status}`)}
                </Label>
              </View>
            </View>
            {!!item.Description && (
              <Label
                style={styles.description}
                numberOfLines={3}
                accessibilityLabel={t('accessibility.item_description', {
                  description: item.Description,
                })}
              >
                {item.Description}
              </Label>
            )}
            <Label
              style={styles.date}
              accessibilityLabel={t('accessibility.reported_date', {
                date: new Date(item.LastChangeDateTimeUtc).toLocaleDateString(),
              })}
            >
              {t('reported')}:{' '}
              {new Date(item.LastChangeDateTimeUtc).toLocaleDateString()}
            </Label>
          </View>
        </View>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  location: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  category: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
})
