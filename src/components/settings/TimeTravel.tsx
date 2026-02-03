import { addWeeks, format, subWeeks } from 'date-fns'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Label } from '@/components/generic/atoms/Label'
import { Section } from '@/components/generic/atoms/Section'
import { Button } from '@/components/generic/containers/Button'
import { Col } from '@/components/generic/containers/Col'
import { Row } from '@/components/generic/containers/Row'
import { conName } from '@/configuration'
import { useCache } from '@/context/data/Cache'
import type { EventDayDetails } from '@/context/data/types.details'
import { useNow } from '@/hooks/time/useNow'

const ONE_HOUR = 60 * 60 * 1000
const ONE_MINUTE = 60 * 1000

export function TimeTravel() {
  const { t } = useTranslation('TimeTravel')
  const { eventDays, getValue, setValue } = useCache()
  const now = useNow()

  const settings = getValue('settings')
  const timeOffset = settings.timeTravelOffset ?? 0
  const enabled = settings.timeTravelEnabled ?? false

  // Calculate week before and after
  const weekBefore = useMemo(() => {
    if (!eventDays.length) return null
    const firstDay = new Date(eventDays[0].Date)
    return subWeeks(firstDay, 1).toISOString()
  }, [eventDays])

  const weekAfter = useMemo(() => {
    if (!eventDays.length) return null
    const lastDay = new Date(eventDays[eventDays.length - 1].Date)
    return addWeeks(lastDay, 1).toISOString()
  }, [eventDays])

  const handleEnableTimeTravel = (value: boolean) =>
    setValue('settings', { ...settings, timeTravelEnabled: value })

  const handleResetTravel = () =>
    setValue('settings', { ...settings, timeTravelOffset: 0 })

  const handleTravel = (amount: number) =>
    setValue('settings', {
      ...settings,
      timeTravelOffset: (settings.timeTravelOffset ?? 0) + amount,
    })

  const handleTravelToDate = (date: string) => {
    const currentDate = new Date()
    const targetDate = new Date(date)
    targetDate.setHours(
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds(),
      currentDate.getMilliseconds()
    )

    const offset = targetDate.getTime() - currentDate.getTime()
    setValue('settings', { ...settings, timeTravelOffset: offset })
  }

  return (
    <View testID='TimeTravel' className='p-4'>
      <Section title={t('title')} icon='airplane' subtitle={t('subtitle')} />
      <Label className='mb-1'>
        {t('originalTime', { time: format(new Date(), 'yyyy-MM-dd HH:mm:ss') })}
      </Label>
      <Label className='mb-1'>
        {t('currentTime', { time: format(now, 'yyyy-MM-dd HH:mm:ss') })}
      </Label>
      <Label className='mb-1'>
        {t('difference', { diff: `${Math.round(timeOffset / 1000)} seconds` })}
      </Label>

      <Row style={styles.row}>
        <Button
          style={styles.button}
          outline={enabled}
          onPress={() => handleEnableTimeTravel(!enabled)}
        >
          {enabled ? t('disable') : t('enable')}
        </Button>
        <Button style={styles.button} onPress={handleResetTravel}>
          {t('reset')}
        </Button>
      </Row>

      <Row style={styles.row}>
        <Button
          containerStyle={styles.button}
          icon='chevron-left'
          iconRight={<View />}
          onPress={() => handleTravel(-ONE_HOUR)}
        >
          1h
        </Button>
        <Button
          containerStyle={styles.button}
          icon='chevron-left'
          iconRight={<View />}
          onPress={() => handleTravel(-ONE_MINUTE)}
        >
          1m
        </Button>
        <Button
          containerStyle={styles.button}
          icon={<View />}
          iconRight='chevron-right'
          onPress={() => handleTravel(ONE_MINUTE)}
        >
          1m
        </Button>
        <Button
          containerStyle={styles.button}
          icon={<View />}
          iconRight='chevron-right'
          onPress={() => handleTravel(ONE_HOUR)}
        >
          1h
        </Button>
      </Row>

      <Col style={styles.row} type='stretch'>
        {weekBefore && (
          <Button
            containerStyle={styles.button}
            icon='calendar-arrow-left'
            onPress={() => handleTravelToDate(weekBefore)}
          >
            {t('week_before', { conName })}
          </Button>
        )}

        {eventDays.map((day: EventDayDetails) => (
          <Button
            key={day.Id}
            containerStyle={styles.button}
            icon='calendar-cursor'
            onPress={() => handleTravelToDate(day.Date)}
          >
            {day.Name}
          </Button>
        ))}

        {weekAfter && (
          <Button
            containerStyle={styles.button}
            icon='calendar-arrow-right'
            onPress={() => handleTravelToDate(weekAfter)}
          >
            {t('week_after', { conName })}
          </Button>
        )}
      </Col>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 5,
    flexGrow: 1,
  },
  row: {
    marginTop: 15,
  },
})
