import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { appStyles } from '../AppStyles'
import { Image } from '../generic/atoms/Image'
import { sourceFromImage } from '../generic/atoms/Image.common'
import { Label } from '../generic/atoms/Label'
import { isPresent, joinOffDays } from './utils'

import { DealerDetails } from '@/context/data/types.details'
import { Pressable } from '@/components/generic/Pressable'

export type DealerDetailsInstance = {
  details: DealerDetails
  present: boolean
  offDays: string
}

/**
 * Creates the dealer instance from the details and precomputed values.
 * @param details The dealer details.
 * @param now The current date.
 * @param day1 The first day label.
 * @param day2 The second day label.
 * @param day3 The third day label.
 */
export function dealerInstanceForAny(details: DealerDetails, now: Date, day1: string, day2: string, day3: string): DealerDetailsInstance {
  return {
    details,
    present: isPresent(details, now),
    offDays: joinOffDays(details, day1, day2, day3),
  }
}

export type DealerCardProps = {
  style?: ViewStyle
  dealer: DealerDetailsInstance
  onPress?: (dealer: DealerDetails) => void
  onLongPress?: (dealer: DealerDetails) => void
}

export const DealerCard: FC<DealerCardProps> = ({ style, dealer, onPress, onLongPress }) => {
  // Details and properties dereference.
  const name = dealer.details.DisplayNameOrAttendeeNickname
  const present = dealer.present
  const description = dealer.details.Categories?.join(', ')
  const offDays = dealer.offDays
  const avatar = sourceFromImage(dealer.details.ArtistThumbnail) ?? sourceFromImage(dealer.details.Artist) ?? require('@/assets/static/ych.png')

  // Translation object.
  const { t } = useTranslation('Dealers')

  // Dependent and independent styles.
  const styleBackground = useThemeBackground('background')
  const stylePre = useThemeBackground(present ? 'primary' : 'darken')
  const avatarBackground = useThemeBackground('text')

  const onPressBind = useCallback(() => onPress?.(dealer.details), [dealer.details, onPress])
  const onLongPressBind = useCallback(() => onLongPress?.(dealer.details), [dealer.details, onLongPress])

  return (
    <Pressable style={[styles.container, appStyles.shadow, styleBackground, style]} onPress={onPressBind} onLongPress={onLongPressBind}>
      <View style={[styles.pre, stylePre]}>
        <Image
          recyclingKey={dealer.details.Id}
          style={[avatarBackground, styles.avatarCircle]}
          source={avatar}
          contentFit="contain"
          placeholder={require('@/assets/static/ych.png')}
        />
      </View>

      <View style={styles.main}>
        <Label type="h3">{name}</Label>

        {!description ? null : (
          <Label key="dealerDescription" type="h4" variant="narrow" ellipsizeMode="tail" numberOfLines={2}>
            {description}
          </Label>
        )}

        {!offDays ? null : (
          <Label key="dealerOffDays" style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
            {t('not_attending_on', { offDays })}
          </Label>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    marginVertical: 15,
    borderRadius: 16,
    flexDirection: 'row',
  },
  background: {
    position: 'absolute',
    width: undefined,
    height: undefined,
  },
  pre: {
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
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
  image: {
    position: 'absolute',
    width: undefined,
    height: undefined,
    left: -10,
    top: -10,
    right: -10,
    bottom: -10,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  main: {
    flex: 1,
    padding: 12,
  },
  tag: {
    textAlign: 'right',
  },
})
