import React, { FC } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'

import { appStyles } from '../AppStyles'
import { Label } from '../generic/atoms/Label'
import { Card } from '../generic/containers/Card'

import { KnowledgeEntryRecord } from '@/context/data/types'

export type KbEntryCardProps = {
    containerStyle?: ViewStyle;
    style?: ViewStyle;
    onPress: (entry: KnowledgeEntryRecord) => void;
    entry: KnowledgeEntryRecord;
};

export const KbEntryCard: FC<KbEntryCardProps> = ({ containerStyle, style, entry, onPress }) => {
    return (
        <Card containerStyle={containerStyle} style={[styles.container, appStyles.shadow, style]} onPress={() => onPress(entry)}>
            <Label>{entry.Title}</Label>
        </Card>
    )
}
const styles = StyleSheet.create({
    container: {
        minHeight: 40,
        marginVertical: 8,
    },
})
