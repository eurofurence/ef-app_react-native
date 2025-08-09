import React, { FC, useCallback } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { useThemeBackground, useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { calculateEventTiming } from '@/util/eventTiming'
import { appStyles } from '../AppStyles'
import { Icon, IconNames } from '../generic/atoms/Icon'
import { sourceFromImage } from '../generic/atoms/Image.common'
import { ImageBackground } from '../generic/atoms/ImageBackground'
import { Label } from '../generic/atoms/Label'
import { Progress } from '../generic/atoms/Progress'
import { Row } from '../generic/containers/Row'
import { EventCardTime } from './EventCardTime'

import { EventDetails } from '@/context/data/types.details'
import { Pressable } from '@/components/generic/Pressable'
import { useTranslation } from 'react-i18next'

const glyphIconSize = 90
const badgeIconSize = 20

export type EventDetailsInstance = {
  details: EventDetails
} & ReturnType<typeof calculateEventTiming>

export function eventInstanceForAny(details: EventDetails, now: Date): EventDetailsInstance {
  return { details, ...calculateEventTiming(details, now) }
}

export function eventInstanceForNotPassed(details: EventDetails, now: Date): EventDetailsInstance {
  return { details, ...calculateEventTiming(details, now) }
}

export function eventInstanceForPassed(details: EventDetails): EventDetailsInstance {
  return { details, ...calculateEventTiming(details, 'done') }
}

export type EventCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  type?: 'duration' | 'time'
  event: EventDetailsInstance
  onPress?: (event: EventDetails) => void
  onLongPress?: (event: EventDetails) => void
}

export const EventCard: FC<EventCardProps> = ({ containerStyle, style, type = 'duration', event, onPress, onLongPress }) => {
  const { t } = useTranslation('Events')

  const {
    details: { Badges: badges, IsInternal, Glyph, Title: title, SubTitle: subtitle, ConferenceRoom, Favorite: favorite, Banner, Id },
  } = event

  const tag = ConferenceRoom?.ShortName ?? ConferenceRoom?.Name

  const glyph: IconNames | undefined = IsInternal ? 'tools' : Glyph
  const happening = event.progress >= 0.0 && event.progress <= 1.0
  const done = event.progress > 1.0
  const progress = event.progress

  const stylePublicContainer = useThemeBackground('background')
  const styleInternalContainer = useThemeBackground('internal')
  const styleContainer = IsInternal ? styleInternalContainer : stylePublicContainer
  const stylePre = useThemeBackground(done ? 'darken' : favorite ? 'notification' : 'primary')
  const styleBadgeFrame = useThemeBackground('secondary')
  const colorBadge = useThemeColorValue('white')
  const colorGlyph = useThemeColorValue('lighten')
  const colorHeart = useThemeColorValue(Banner ? 'white' : 'text')

  const onPressBind = useCallback(() => onPress?.(event.details), [event.details, onPress])
  const onLongPressBind = useCallback(() => onLongPress?.(event.details), [event.details, onLongPress])

  return (
    <View style={containerStyle}>
      <Pressable style={[styles.container, appStyles.shadow, styleContainer, style]} onPress={onPressBind} onLongPress={onLongPressBind}>
        <View style={[styles.pre, stylePre]}>
          {glyph && (
            <View key="eventGlyph" style={styles.glyphContainer}>
              <Icon style={styles.glyph} name={glyph} size={glyphIconSize} color={colorGlyph} />
            </View>
          )}
          <EventCardTime type={type} event={event} done={done} />

          {happening && (
            <Label key="eventHappening" style={styles.happening} type="cap" color={done ? 'important' : 'white'} variant="receded">
              LIVE
            </Label>
          )}
        </View>

        {Banner ? (
          <View style={styles.mainPoster}>
            <ImageBackground key={Id} recyclingKey={Id} source={sourceFromImage(Banner)} contentFit="cover" style={StyleSheet.absoluteFill}>
              <View style={styles.tagArea2}>
                <View style={styles.tagAreaInner}>
                  <Label style={styles.tag} type="regular" color="white" ellipsizeMode="head" numberOfLines={1}>
                    {IsInternal ? `${t('internal')} – ` : ''}
                    {tag || `${title} ${subtitle}`}
                  </Label>
                  {tag && (
                    <Label style={styles.tag} type="regular" color="white" ellipsizeMode="head" numberOfLines={1}>
                      {tag}
                    </Label>
                  )}
                </View>
              </View>
              {happening && <Progress key="eventProgress" style={styles.progress} value={progress} color="white" />}
            </ImageBackground>
          </View>
        ) : (
          <View style={styles.mainText}>
            <Row>
              <Label style={styles.title} type="h3">
                {title}
              </Label>
              {badges?.map((icon) => (
                <View key={icon} style={[styles.badgeFrame, styleBadgeFrame]}>
                  <Icon name={icon} color={colorBadge} size={badgeIconSize} />
                </View>
              ))}
            </Row>
            <Label type="h4" variant="narrow">
              {subtitle}
            </Label>
            <Label style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
              {IsInternal ? `${t('internal')} – ` : ''}
              {tag}
            </Label>

            {happening && <Progress key="eventProgress" style={styles.progress} value={progress} />}
          </View>
        )}

        {favorite && (
          <View key="eventFavorite" style={styles.favorite}>
            <Icon name="heart" size={20} color={colorHeart} />
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
  glyphContainer: {
    position: 'absolute',
    left: -20,
    top: -20,
    right: -20,
    bottom: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  happening: {
    position: 'absolute',
    top: 0,
    padding: 2,
    alignItems: 'center',
  },
  glyph: {
    opacity: 0.25,
    transform: [{ rotate: '-15deg' }],
  },
  badgeFrame: {
    borderRadius: 20,
    aspectRatio: 1,
    padding: 4,
    marginLeft: 8,
  },
  pre: {
    overflow: 'hidden',
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPoster: {
    height: 120,
    flex: 1,
    padding: 12,
  },
  mainText: {
    flex: 1,
    padding: 12,
  },
  title: {
    flex: 1,
  },
  tag: {
    textAlign: 'right',
  },
  tagArea2: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignContent: 'flex-start',
    alignItems: 'stretch',
    height: '100%',
  },
  tagAreaInner: {
    backgroundColor: '#000000A0',
    padding: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  favorite: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  progress: {
    position: 'absolute',
    left: 0,
    bottom: -2,
    right: 0,
    height: 6,
  },
})
