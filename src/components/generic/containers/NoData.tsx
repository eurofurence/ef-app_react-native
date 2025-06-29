import { StyleSheet, View } from 'react-native'
import React, { ReactNode } from 'react'
import { Icon } from '../atoms/Icon'
import { Label } from '../atoms/Label'

import { useThemeColor } from '@/hooks/themes/useThemeHooks'

export type NoDataProps = {
  text: ReactNode | string
}

export const NoData = ({ text }: NoDataProps) => {
  const textStyle = useThemeColor('text')

  return (
    <View style={[styles.container]}>
      <Icon name="calendar-alert" size={40} style={{ marginBottom: 20 }} color={textStyle?.color} />
      <Label type="h3" variant="narrow" color="text">
        {text}
      </Label>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxHeight: '100%',
    height: 400,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
