import React from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { Button } from '@/components/generic/containers/Button'
import { Row } from '@/components/generic/containers/Row'
import { LabelProps } from '@/components/generic/atoms/Label'

export type ChoiceButtonsProps<T = string> = {
  style?: StyleProp<ViewStyle>
  labelType?: LabelProps['type']
  labelVariant?: LabelProps['variant']
  choices: T[]
  choice: T
  setChoice: (choice: T) => void
  getLabel: (choice: T) => string
}

export const ChoiceButtons = <T,>({ style, labelType, labelVariant, choices, choice, setChoice, getLabel }: ChoiceButtonsProps<T>) => {
  return (
    <Row type="center" variant="center" style={style}>
      {choices.map((item, i) => (
        <Button
          key={typeof item === 'string' ? item : i}
          labelType={labelType}
          labelVariant={labelVariant}
          style={i === 0 ? styles.left : i === choices.length - 1 ? styles.right : styles.center}
          outline={item === choice}
          onPress={() => setChoice(item)}
        >
          {getLabel(item)}
        </Button>
      ))}
    </Row>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  left: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
  },
  right: {
    flex: 1,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
})
