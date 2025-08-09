import React, { FC } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { appStyles } from '../AppStyles'
import { Label } from '../generic/atoms/Label'
import { Card } from '../generic/containers/Card'

import { KnowledgeEntryDetails } from '@/context/data/types.details'

export type KbEntryCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  onPress: (entry: KnowledgeEntryDetails) => void
  entry: KnowledgeEntryDetails
}

export const KbEntryCard: FC<KbEntryCardProps> = ({ containerStyle, style, entry, onPress }) => {
  return (
    <View style={containerStyle}>
      <Card style={[styles.container, appStyles.shadow, style]} onPress={() => onPress(entry)}>
        <Label type="h3">{entry.Title}</Label>
      </Card>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    marginVertical: 8,
  },
})
