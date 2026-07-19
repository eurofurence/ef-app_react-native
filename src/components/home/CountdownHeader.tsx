import { useLiveQuery } from '@tanstack/react-db'
import { formatDistance, isSameDay } from 'date-fns' // Import date-fns utilities
import { fromZonedTime } from 'date-fns-tz' // Import from date-fns-tz package
import type { TFunction } from 'i18next'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native'
import { conId, conName, conTimeZone } from '@/configuration'
import { daysCollection } from '@/data/collections/content/Days'
import type { EfDay } from '@/data/types/EfDay'
import { useRegistrationDatesQuery } from '@/hooks/api/useRegistrationDatesQuery'
import { useNow } from '@/hooks/time/useNow'
import { dateFnsLocales } from '@/i18n'
import { parseDefaultISO } from '@/util/parseDefaultISO'

import { Image } from '../generic/atoms/Image'
import { ImageBackground } from '../generic/atoms/ImageBackground'
import { Label, labelTypeStyles } from '../generic/atoms/Label'
import { Col } from '../generic/containers/Col'

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
const useCountdownTitle = (
  t: TFunction,
  now: Date,
  currentLanguage: string
) => {
  const { data: days } = useLiveQuery(daysCollection)
  const { data: dates } = useRegistrationDatesQuery()

  // Try finding current day.
  const currentDay = days.find((it: EfDay) =>
    isSameDayInTimezone(now, it.Date, conTimeZone)
  )
  if (currentDay) return currentDay.Name

  if (dates) {
    // Check if before the convention.
    if (now < dates.conStart) {
      const locale =
        dateFnsLocales[currentLanguage as keyof typeof dateFnsLocales] ||
        dateFnsLocales.en
      const diff = formatDistance(dates.conStart, now, {
        locale,
        addSuffix: true,
      })
      return t('before_event', { conName, diff })
    }

    // Check if after the convention.
    if (now > dates.conEnd) {
      return t('after_event')
    }
  }

  return conName // Fallback if no dates exist.
}

export const CountdownHeader: FC<CountdownHeaderProps> = ({ style }) => {
  const { t, i18n } = useTranslation('Countdown')
  const { t: tAccessibility } = useTranslation('Home', {
    keyPrefix: 'accessibility',
  })
  const now = useNow() // Convert to Date

  const { width } = useWindowDimensions()
  const subtitle = useCountdownTitle(t, now, i18n.language)

  return (
    <View
      style={[styles.container, style]}
      role='banner'
      accessibilityLabel={tAccessibility('countdown_header')}
      accessibilityHint={tAccessibility('countdown_header_hint')}
    >
      <ImageBackground
        key='banner'
        style={StyleSheet.absoluteFill}
        source={
          width < bannerBreakpoint
            ? require('@/assets/static/bannernarrow.png')
            : require('@/assets/static/bannerwide.png')
        }
        contentFit='cover'
        priority='high'
        accessibilityLabel={tAccessibility('banner_image')}
        accessibilityRole='image'
      />
      <View style={[StyleSheet.absoluteFill, styles.cover]} />
      <Image
        style={styles.logo}
        source={require('@/assets/static/bannerlogo.png')}
        priority='high'
        accessibilityLabel={tAccessibility('convention_logo')}
        accessibilityRole='image'
      />
      <Col variant='end' style={styles.textContainer}>
        <Label
          type='xl'
          variant='shadow'
          color='white'
          ellipsizeMode='tail'
          accessibilityRole='header'
          accessibilityLabel={tAccessibility('convention_name', {
            name: conId,
          })}
        >
          {conId}
        </Label>
        <Label
          style={{
            marginLeft: 2,
            marginBottom:
              labelTypeStyles.compact.fontSize -
              labelTypeStyles.compact.lineHeight,
          }}
          type='compact'
          variant='shadow'
          color='white'
          ellipsizeMode='tail'
          accessibilityLabel={tAccessibility('countdown_status', {
            status: subtitle,
          })}
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
