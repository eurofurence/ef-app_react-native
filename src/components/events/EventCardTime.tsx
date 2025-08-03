import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { Label } from '../generic/atoms/Label'
import { EventDetailsInstance } from './EventCard'

export type EventCardTimeProps = {
  type: 'duration' | 'time'
  event: EventDetailsInstance
  done: boolean
}

export const EventCardTime: FC<EventCardTimeProps> = ({ type, event, done }) => {
  const { start, end, day, startLocal, endLocal, dayLocal } = event
  const showLocal = start !== startLocal

  return (
    <View style={styles.container}>
      {type === 'duration' ? (
        <>
          <Label type="h3" variant="middle" color={done ? 'important' : 'white'}>
            {start} {end}
          </Label>
          <Label type="cap" color={done ? 'important' : 'white'}>
            {day}
          </Label>
          {!showLocal ? null : (
            <>
              <Label type="cap" variant="receded" color={done ? 'important' : 'white'}>
                {startLocal} {endLocal} local
              </Label>
            </>
          )}
        </>
      ) : (
        <>
          <Label type="h3" variant="middle" color={done ? 'important' : 'white'}>
            {start}
          </Label>
          <Label type="cap" color={done ? 'important' : 'white'}>
            {day}
          </Label>
          {!showLocal ? null : (
            <>
              <Label type="cap" variant="receded" color={done ? 'important' : 'white'}>
                {startLocal} {dayLocal}
              </Label>
              <Label type="cap" variant="receded" color={done ? 'important' : 'white'}>
                local
              </Label>
            </>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
