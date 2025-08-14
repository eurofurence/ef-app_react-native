import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { Icon } from '@/components/generic/atoms/Icon'
import { Pressable } from '@/components/generic/Pressable'
import { DealerDetails } from '@/context/data/types.details'
import { useThemeBackground, useThemeColorValue } from '@/hooks/themes/useThemeHooks'

import { appStyles } from '../AppStyles'
import { Image } from '../generic/atoms/Image'
import { sourceFromImage } from '../generic/atoms/Image.common'
import { Label } from '../generic/atoms/Label'

import { isPresent, joinOffDays } from './utils'

export type DealerDetailsInstance = {
  details: DealerDetails
  present: boolean
  offDays: string
}

export function dealerInstanceForAny(details: DealerDetails, now: Date, day1: string, day2: string, day3: string): DealerDetailsInstance {
  return {
    details,
    present: isPresent(details, now),
    offDays: joinOffDays(details, day1, day2, day3),
  }
}

export type DealerCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  dealer: DealerDetailsInstance
  onPress?: (dealer: DealerDetails) => void
  onLongPress?: (dealer: DealerDetails) => void
}

export const DealerCard: FC<DealerCardProps> = ({ containerStyle, style, dealer, onPress, onLongPress }) => {
  const name = dealer.details.DisplayNameOrAttendeeNickname
  const present = dealer.present
  const description = dealer.details.Categories?.join(', ')
  const offDays = dealer.offDays
  const favorite = dealer.details.Favorite
  const avatar = sourceFromImage(dealer.details.ArtistThumbnail) ?? sourceFromImage(dealer.details.Artist) ?? require('@/assets/static/ych.png')

  const { t } = useTranslation('Dealers')

  const styleBackground = useThemeBackground('background')
  const stylePre = useThemeBackground(!present ? 'darken' : favorite ? 'notification' : 'primary')
  const avatarBackground = useThemeBackground('text')
  const colorHeart = useThemeColorValue('text')

  const onPressBind = useCallback(() => onPress?.(dealer.details), [dealer.details, onPress])
  const onLongPressBind = useCallback(() => onLongPress?.(dealer.details), [dealer.details, onLongPress])

  const accessibilityLabel = [
    t('accessibility.dealer_card', { name }),
    description && t('accessibility.dealer_categories', { categories: description }),
    offDays && t('accessibility.dealer_off_days', { offDays }),
    favorite && t('accessibility.dealer_favorited'),
    !present && t('accessibility.dealer_not_present'),
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <View style={containerStyle}>
      <Pressable
        style={[styles.container, appStyles.shadow, styleBackground, style]}
        onPress={onPressBind}
        onLongPress={onLongPressBind}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t('accessibility.dealer_card_hint')}
      >
        <View style={[styles.pre, stylePre]}>
          <Image
            key={dealer.details.Id}
            recyclingKey={dealer.details.Id}
            style={[avatarBackground, styles.avatarCircle]}
            source={avatar}
            contentFit="contain"
            placeholder={require('@/assets/static/ych.png')}
            accessibilityLabel={t('accessibility.dealer_avatar', { name })}
            accessibilityRole="image"
          />
        </View>

        <View style={styles.main}>
          <Label type="h3" accessibilityRole="header">
            {name}
          </Label>

          {!!description && (
            <Label
              key="dealerDescription"
              type="h4"
              variant="narrow"
              ellipsizeMode="tail"
              numberOfLines={2}
              accessibilityLabel={t('accessibility.dealer_categories', { categories: description })}
            >
              {description}
            </Label>
          )}

          {!!offDays && (
            <Label
              key="dealerOffDays"
              style={styles.tag}
              type="regular"
              ellipsizeMode="head"
              numberOfLines={1}
              accessibilityLabel={t('accessibility.dealer_off_days', { offDays })}
            >
              {t('not_attending_on', { offDays })}
            </Label>
          )}
        </View>

        {!!favorite && (
          <View key="eventFavorite" style={styles.favorite}>
            <Icon name="heart" size={20} color={colorHeart} accessibilityLabel={t('accessibility.dealer_favorite_icon')} accessibilityRole="image" />
          </View>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    marginVertical: 15,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  pre: {
    overflow: 'hidden',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  main: {
    flex: 1,
    padding: 12,
  },
  tag: {
    textAlign: 'right',
  },
  favorite: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
})
