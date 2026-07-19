import type { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import { Label } from '../generic/atoms/Label'

export type EventCardTimeProps = {
  type: 'duration' | 'time'
  start: string;
  end: string;
  day: string;
  startLocal: string;
  endLocal: string;
  dayLocal: string;
  done: boolean;
}

export const EventCardTime2: FC<EventCardTimeProps> = ({
                                                         type,
                                                         start,
                                                         end,
                                                         day,
                                                         startLocal,
                                                         endLocal,
                                                         dayLocal,
                                                         done,
                                                       }) => {
  const showLocal = start !== startLocal

  return (
    <View style={styles.container}>
      {type === 'duration' ? (
        <>
          <Label
            type="h3"
            variant="middle"
            color={done ? 'important' : 'white'}
          >
            {start}
          </Label>
          <Label
            type="h3"
            variant="middle"
            color={done ? 'important' : 'white'}
          >
            {end}
          </Label>
          <Label type="cap" color={done ? 'important' : 'white'}>
            {day}
          </Label>
          {!showLocal ? null : (
            <Label
              type="cap"
              variant="receded"
              color={done ? 'important' : 'white'}
            >
              {startLocal} {endLocal} local
            </Label>
          )}
        </>
      ) : (
        <>
          <Label
            type="h3"
            variant="middle"
            color={done ? 'important' : 'white'}
          >
            {start}
          </Label>
          <Label type="cap" color={done ? 'important' : 'white'}>
            {day}
          </Label>
          {!showLocal ? null : (
            <>
              <Label
                type="cap"
                variant="receded"
                color={done ? 'important' : 'white'}
              >
                {startLocal} {dayLocal}
              </Label>
              <Label
                type="cap"
                variant="receded"
                color={done ? 'important' : 'white'}
              >
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
