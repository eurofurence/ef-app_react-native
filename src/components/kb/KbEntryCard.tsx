import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { KnowledgeEntryDetails } from '@/context/data/types.details'

import { appStyles } from '../AppStyles'
import { Label } from '../generic/atoms/Label'
import { Card } from '../generic/containers/Card'

export type KbEntryCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  onPress: (entry: KnowledgeEntryDetails) => void
  entry: KnowledgeEntryDetails
}

export const KbEntryCard: FC<KbEntryCardProps> = ({ containerStyle, style, entry, onPress }) => {
  const { t } = useTranslation('KnowledgeGroups')

  return (
    <View style={containerStyle}>
      <Card
        style={[styles.container, appStyles.shadow, style]}
        onPress={() => onPress(entry)}
        accessibilityRole="button"
        accessibilityLabel={t('accessibility.kb_entry_card', { title: entry.Title })}
        accessibilityHint={t('accessibility.kb_entry_card_hint')}
      >
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
