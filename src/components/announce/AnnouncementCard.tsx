import { FC } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { appStyles } from '../AppStyles'
import { Label } from '../generic/atoms/Label'
import { ImageBackground } from '../generic/atoms/ImageBackground'
import { sourceFromImage } from '../generic/atoms/Image.common'
import { colorForArea } from './utils'
import { useThemeBackground, useThemeName } from '@/hooks/themes/useThemeHooks'

import { AnnouncementDetails } from '@/context/data/types.details'
import { Pressable } from '@/components/generic/Pressable'

export type AnnouncementDetailsInstance = {
  details: AnnouncementDetails
  time: string
}

export type AnnouncementCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  announcement: AnnouncementDetailsInstance
  onPress?: (announcement: AnnouncementDetails) => void
  onLongPress?: (announcement: AnnouncementDetails) => void
}

export const AnnouncementCard: FC<AnnouncementCardProps> = ({ containerStyle, style, announcement, onPress, onLongPress }) => {
  const { t } = useTranslation('Announcements')

  // Dependent and independent styles.
  const styleContainer = useThemeBackground('background')
  const saturationValue = useThemeName() === 'dark' ? 0.5 : 0.7
  const stylePre = useThemeBackground('primary')
  const styleAreaIndicator = { backgroundColor: colorForArea(announcement.details.Area, saturationValue, 0.76) }

  // Create accessibility label with announcement details
  const accessibilityLabel = t('accessibility.announcement_card', {
    title: announcement.details.NormalizedTitle,
    area: announcement.details.Area,
    time: announcement.time,
  })

  return (
    <View style={containerStyle}>
      <Pressable
        style={[styles.container, appStyles.shadow, styleContainer, style]}
        onPress={() => onPress?.(announcement.details)}
        onLongPress={() => onLongPress?.(announcement.details)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t('accessibility.announcement_card_hint')}
      >
        <ImageBackground style={[styles.pre, stylePre]} source={sourceFromImage(announcement.details.Image)}>
          <View style={[styles.areaIndicator, styleAreaIndicator]} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants" />
        </ImageBackground>

        <View style={styles.main}>
          <Label style={styles.title} type="h3">
            {announcement.details.NormalizedTitle}
          </Label>
          <Label style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
            {announcement.time} - {announcement.details.Area}
          </Label>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    minHeight: 80,
    marginVertical: 15,
    borderRadius: 16,
    flexDirection: 'row',
  },
  pre: {
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 5,
  },
  main: {
    flex: 1,
    padding: 12,
  },
  title: {
    flex: 1,
  },
  tag: {
    textAlign: 'right',
  },
})
