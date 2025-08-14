import { formatInTimeZone } from 'date-fns-tz'
import { useCalendars } from 'expo-localization'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { conName, conTimeZone } from '@/configuration'
import { useWarningState } from '@/hooks/data/useWarningState'

import { Label } from '../generic/atoms/Label'
import { Badge } from '../generic/containers/Badge'

export type TimezoneWarningProps = {
  /**
   * The padding used by the parent horizontally.
   */
  parentPad?: number
}

const getUtcOffset = (date: Date, timeZone: string): number => {
  // Format the date in the specified time zone using the pattern "xxx" (e.g., +02:00 or -05:00)
  const offsetStr = formatInTimeZone(date, timeZone, 'xxx')
  const sign = offsetStr.startsWith('-') ? -1 : 1
  const [hours, minutes] = offsetStr.substring(1).split(':').map(Number)
  return sign * (hours * 60 + minutes)
}

export const TimezoneWarning: FC<TimezoneWarningProps> = ({ parentPad = 0 }) => {
  const { t } = useTranslation('Home')
  const { t: tAccessibility } = useTranslation('Home', { keyPrefix: 'accessibility' })
  const { timeZone } = useCalendars()[0]
  const { isHidden, hideWarning } = useWarningState('timeZoneWarningsHidden')

  if (isHidden) {
    return null
  }

  const now = new Date()
  const conTimeZoneOffset = getUtcOffset(now, conTimeZone)
  const deviceTimeZoneOffset = getUtcOffset(now, timeZone ?? conTimeZone)

  if (conTimeZoneOffset === deviceTimeZoneOffset) {
    return null
  }

  return (
    <Badge unpad={parentPad} badgeColor="background" textColor="text" textType="para" icon="clock" role="alert" accessibilityLabel={tAccessibility('timezone_warning_container')}>
      <Label
        accessibilityLabel={tAccessibility('timezone_warning_content', {
          convention: conName,
          conTimeZone,
          deviceTimeZone: timeZone,
        })}
      >
        {t('different_timezone', { convention: conName, conTimeZone, deviceTimeZone: timeZone })}
      </Label>
      <Label
        variant="bold"
        color="secondary"
        onPress={hideWarning}
        accessibilityRole="button"
        accessibilityLabel={tAccessibility('hide_timezone_warning')}
        accessibilityHint={tAccessibility('hide_timezone_warning_hint')}
      >
        {' ' + t('warnings.hide')}
      </Label>
    </Badge>
  )
}
