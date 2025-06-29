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
  const { start, day, startLocal, dayLocal, runtime } = event
  const showLocal = start !== startLocal

  return (
    <View style={styles.container}>
      {type === 'duration' ? (
        <>
          <Label type="h3" color={done ? 'important' : 'white'}>
            {runtime}
          </Label>
          <Label type="cap" color={done ? 'important' : 'white'}>
            {start}
          </Label>
          {!showLocal ? null : (
            <>
              <Label type="cap" variant="receded" color={done ? 'important' : 'white'}>
                {startLocal} local
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
  },
})
