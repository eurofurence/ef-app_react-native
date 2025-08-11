import { useIsFocused } from '@react-navigation/core'
import { TFunction } from 'i18next'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native'

import { fromZonedTime } from 'date-fns-tz' // Import from date-fns-tz package
import { formatDistance, isSameDay } from 'date-fns' // Import date-fns utilities
import { Image } from '../generic/atoms/Image'
import { ImageBackground } from '../generic/atoms/ImageBackground'
import { Label, labelTypeStyles } from '../generic/atoms/Label'
import { Col } from '../generic/containers/Col'
import { useNow } from '@/hooks/time/useNow'
import { conId, conName, conTimeZone } from '@/configuration'
import { EventDayRecord } from '@/context/data/types.api'
import { useCache } from '@/context/data/Cache'
import { parseDefaultISO } from '@/util/parseDefaultISO'

export type CountdownHeaderProps = {
  style?: StyleProp<ViewStyle>
}

const bannerBreakpoint = 600

/**
 * Checks if a given Date is the same day as another, considering the provided timezone.
 */
const isSameDayInTimezone = (date1: Date, date2: string, timezone: string) => {
  const localDate1 = fromZonedTime(date1, timezone) // Convert date1 to UTC based on the timezone
  const localDate2 = fromZonedTime(parseDefaultISO(date2), timezone) // Convert date2 (event date) to UTC based on the timezone

  return isSameDay(localDate1, localDate2) // Compare the two dates
}

/**
 * Calculates the countdown title based on current time and event days.
 */
const useCountdownTitle = (t: TFunction, now: Date) => {
  const { eventDays } = useCache()
  const firstDay = eventDays[0]
  const lastDay = eventDays[eventDays.length - 1]

  // Try finding current day.
  const currentDay = eventDays.find((it: EventDayRecord) => isSameDayInTimezone(now, it.Date, conTimeZone))
  if (currentDay) return currentDay.Name

  // Check if before first day.
  if (firstDay) {
    const firstDate = new Date(firstDay.Date)
    if (now < firstDate) {
      const diff = formatDistance(firstDate, now)
      return t('before_event', { conName, diff })
    }
  }

  // Check if after last day.
  if (lastDay) {
    const lastDate = new Date(lastDay.Date)
    if (now > lastDate) {
      return t('after_event')
    }
  }

  return conName // Fallback if no event days exist.
}

export const CountdownHeader: FC<CountdownHeaderProps> = ({ style }) => {
  const { t } = useTranslation('Countdown')
  const { t: tAccessibility } = useTranslation('Home', { keyPrefix: 'accessibility' })
  const isFocused = useIsFocused()
  const now = useNow(isFocused ? 60 : 'static') // Convert to Date

  const { width } = useWindowDimensions()
  const subtitle = useCountdownTitle(t, now)

  return (
    <View style={[styles.container, style]} role="banner" accessibilityLabel={tAccessibility('countdown_header')} accessibilityHint={tAccessibility('countdown_header_hint')}>
      <ImageBackground
        key="banner"
        style={StyleSheet.absoluteFill}
        source={width < bannerBreakpoint ? require('@/assets/static/banner_narrow.png') : require('@/assets/static/banner_wide.png')}
        contentFit="cover"
        priority="high"
        accessibilityLabel={tAccessibility('banner_image')}
        accessibilityRole="image"
      />
      <View style={[StyleSheet.absoluteFill, styles.cover]} />
      <Image
        style={styles.logo}
        source={require('@/assets/static/banner_logo.png')}
        priority="high"
        accessibilityLabel={tAccessibility('convention_logo')}
        accessibilityRole="image"
      />
      <Col variant="end" style={styles.textContainer}>
        <Label type="xl" variant="shadow" color="white" ellipsizeMode="tail" accessibilityRole="header" accessibilityLabel={tAccessibility('convention_name', { name: conId })}>
          {conId}
        </Label>
        <Label
          style={{
            marginLeft: 2,
            marginBottom: labelTypeStyles.compact.fontSize - labelTypeStyles.compact.lineHeight,
          }}
          type="compact"
          variant="shadow"
          color="white"
          ellipsizeMode="tail"
          accessibilityLabel={tAccessibility('countdown_status', { status: subtitle })}
        >
          {subtitle}
        </Label>
      </Col>
    </View>
  )
}

const styles = StyleSheet.create({
  cover: {
    backgroundColor: '#00000020',
  },
  container: {
    height: 240,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  textContainer: {
    flex: 1,
    paddingBottom: 15,
  },
  logo: {
    height: 130,
    aspectRatio: 1,
  },
})
