import React, { FC } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { appStyles } from '../AppStyles'
import { Banner } from '../generic/atoms/Banner'
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
    <Card containerStyle={containerStyle} style={[styles.container, appStyles.shadow, style]} onPress={() => onPress(entry)}>
      {entry.Images && entry.Images.length > 0 && (
        <View style={styles.imageContainer}>
          <Banner image={entry.Images[0]} viewable />
        </View>
      )}
      <Label style={styles.title}>{entry.Title}</Label>
    </Card>
  )
}
const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    marginVertical: 8,
  },
  imageContainer: {
    marginBottom: 8,
  },
  title: {
    marginTop: 4,
  },
})
