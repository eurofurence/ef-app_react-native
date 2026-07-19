import type {EfDealerFull} from "@/data/collections/content/DealersFull";
import {useCurrentEfDay} from "@/data/hooks/useCurrentEfDay";
import {isDayOfWeek} from "@/data/utils/isDayOfWeek";
import {useNow} from "@/hooks/time/useNow";
import {useCallback, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, View, type ViewStyle} from 'react-native'

import {Icon} from '@/components/generic/atoms/Icon'
import {Pressable} from '@/components/generic/Pressable'
import {
  useThemeBackground,
  useThemeColorValue,
} from '@/hooks/themes/useThemeHooks'

import {appStyles} from '../AppStyles'
import {Image} from '../generic/atoms/Image'
import {sourceFromImage} from '../generic/atoms/Image.common'
import {Label} from '../generic/atoms/Label'

export type DealerCard2Props = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  dealer: EfDealerFull
  onPress?: (dealer: EfDealerFull) => void
  onLongPress?: (dealer: EfDealerFull) => void
}

export function DealerCard2(
  {
    containerStyle,
    style,
    dealer,
    onPress,
    onLongPress,
  }: DealerCard2Props) {
  const now = useNow()
  const today = useCurrentEfDay(now)

  const name = dealer.DisplayNameOrAttendeeNickname
  const present = useMemo(() => today && (
    dealer.AttendsOnThursday && isDayOfWeek(today.Date, 4) ||
    dealer.AttendsOnFriday && isDayOfWeek(today.Date, 5) ||
    dealer.AttendsOnSaturday && isDayOfWeek(today.Date, 6)
  ), [dealer, today])
  const offDays = useMemo(() => [
    !dealer.AttendsOnThursday && 'Thursday',
    !dealer.AttendsOnFriday && 'Friday',
    !dealer.AttendsOnSaturday && 'Saturday',
  ].filter(Boolean).join(', '), [dealer])

  const description = dealer.Categories?.join(', ')
  const favorite = Boolean(dealer.Favorite)
  const avatar =
    sourceFromImage(dealer.ArtistThumbnail) ??
    sourceFromImage(dealer.Artist) ??
    require('@/assets/static/ych.png')

  const {t} = useTranslation('Dealers')

  const styleBackground = useThemeBackground('background')
  const stylePre = useThemeBackground(
    !present ? 'darken' : favorite ? 'notification' : 'primary'
  )
  const avatarBackground = useThemeBackground('text')
  const colorHeart = useThemeColorValue('text')

  const onPressBind = useCallback(
    () => onPress?.(dealer),
    [dealer, onPress]
  )
  const onLongPressBind = useCallback(
    () => onLongPress?.(dealer),
    [dealer, onLongPress]
  )

  const accessibilityLabel = [
    t('accessibility.dealer_card', {name}),
    description &&
    t('accessibility.dealer_categories', {categories: description}),
    offDays && t('accessibility.dealer_off_days', {offDays}),
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
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t('accessibility.dealer_card_hint')}
      >
        <View style={[styles.pre, stylePre]}>
          <Image
            key={dealer.Id}
            recyclingKey={dealer.Id}
            style={[avatarBackground, styles.avatarCircle]}
            source={avatar}
            contentFit='contain'
            placeholder={require('@/assets/static/ych.png')}
            accessibilityLabel={t('accessibility.dealer_avatar', {name})}
            accessibilityRole='image'
          />
        </View>

        <View style={styles.main}>
          <Label type='h3' accessibilityRole='header'>
            {name}
          </Label>

          {!!description && (
            <Label
              key='dealerDescription'
              type='h4'
              variant='narrow'
              ellipsizeMode='tail'
              numberOfLines={2}
              accessibilityLabel={t('accessibility.dealer_categories', {
                categories: description,
              })}
            >
              {description}
            </Label>
          )}

          {!offDays ? null : (
            <Label
              key='dealerOffDays'
              style={styles.tag}
              type='regular'
              ellipsizeMode='head'
              numberOfLines={1}
              accessibilityLabel={t('accessibility.dealer_off_days', {
                offDays,
              })}
            >
              {t('not_attending_on', {offDays})}
            </Label>
          )}
        </View>

        {favorite && (
          <View key='eventFavorite' style={styles.favorite}>
            <Icon
              name='heart'
              size={20}
              color={colorHeart}
              accessibilityLabel={t('accessibility.dealer_favorite_icon')}
              accessibilityRole='image'
            />
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
