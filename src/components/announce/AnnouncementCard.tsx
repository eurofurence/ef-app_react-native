import { formatDistanceToNow } from 'date-fns'
import { type FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import { Pressable } from '@/components/generic/Pressable'
import type { EfAnnouncementFull } from '@/data/collections/content/AnnouncementsFull'
import { useThemeBackground, useThemeName } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'
import { appStyles } from '../AppStyles'
import { sourceFromImage } from '../generic/atoms/Image.common'
import { ImageBackground } from '../generic/atoms/ImageBackground'
import { Label } from '../generic/atoms/Label'
import { colorForArea } from './utils'

export type AnnouncementCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  announcement: EfAnnouncementFull
  onPress?: (announcement: EfAnnouncementFull) => void
  onLongPress?: (announcement: EfAnnouncementFull) => void
}

export const AnnouncementCard: FC<AnnouncementCardProps> = ({
  containerStyle,
  style,
  announcement,
  onPress,
  onLongPress,
}) => {
  const { t } = useTranslation('Announcements')

  // Dependent and independent styles.
  const styleContainer = useThemeBackground('background')
  const saturationValue = useThemeName() === 'dark' ? 0.5 : 0.7
  const stylePre = useThemeBackground('primary')
  const styleAreaIndicator = {
    backgroundColor: colorForArea(announcement.Area, saturationValue, 0.76),
  }
  const now = useNow()
  const time = useMemo(() => {
    return formatDistanceToNow(announcement.ValidFromDateTimeUtc, {
      addSuffix: true,
    })
  }, [announcement.ValidFromDateTimeUtc, now])

  // Create accessibility label with announcement details
  const accessibilityLabel = t('accessibility.announcement_card', {
    title: announcement.Title,
    area: announcement.Area,
    time: time,
  })

  return (
    <View style={containerStyle}>
      <Pressable
        style={[styles.container, appStyles.shadow, styleContainer, style]}
        onPress={() => onPress?.(announcement)}
        onLongPress={() => onLongPress?.(announcement)}
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t('accessibility.announcement_card_hint')}
      >
        <ImageBackground
          style={[styles.pre, stylePre]}
          source={sourceFromImage(announcement.Image)}
        >
          <View
            style={[styles.areaIndicator, styleAreaIndicator]}
            accessibilityElementsHidden={true}
            importantForAccessibility='no-hide-descendants'
          />
        </ImageBackground>

        <View style={styles.main}>
          <Label style={styles.title} type='h3'>
            {announcement.Title}
          </Label>
          <Label
            style={styles.tag}
            type='regular'
            ellipsizeMode='head'
            numberOfLines={1}
          >
            {time} - {announcement.Area}
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
