import React, { FC } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { appStyles } from '../AppStyles'
import { Label } from '../generic/atoms/Label'
import { ImageBackground } from '../generic/atoms/ImageBackground'
import { sourceFromImage } from '../generic/atoms/Image.common'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { TableRegistrationRecord } from '@/context/data/types.api'
import { stateToBackground } from '@/components/artists-alley/utils'
import { differenceInHours, parseISO } from 'date-fns'

export type TableRegistrationInstance = {
  details: TableRegistrationRecord
  visibility: 'visible' | 'grayed' | 'hidden'
}

export function tableRegistrationInstanceForAny(details: TableRegistrationRecord, now: Date): TableRegistrationInstance {
  // TODO: This time  calculation is fucky.
  const date = parseISO(details.LastChangeDateTimeUtc + 'Z')
  const age = differenceInHours(now, date)
  const isGrayed = age > 1
  const isHidden = age > 3
  // TODO: Should not be fully hidden, otherwise no one will reject and the registrand is never notified.
  const visibility = isHidden ? 'grayed' : isGrayed ? 'grayed' : 'visible'
  return { details, visibility }
}

export type ArtistsAlleyCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  item: TableRegistrationInstance
  onPress?: (item: TableRegistrationInstance) => void
  onLongPress?: (item: TableRegistrationInstance) => void
}

export const ArtistsAlleyCard: FC<ArtistsAlleyCardProps> = ({ containerStyle, style, item, onPress, onLongPress }) => {
  // Dependent and independent styles.
  const styleContainer = useThemeBackground('background')
  const stylePre = useThemeBackground('primary')
  const styleAreaIndicator = useThemeBackground(stateToBackground[item.details.State])
  const styleDarken = useThemeBackground('darken')

  // Should be prefiltered, but we will also not show it.
  if (item.visibility === 'hidden') return null

  return (
    <TouchableOpacity
      containerStyle={item.visibility === 'grayed' ? [containerStyle, styles.transparent] : containerStyle}
      style={[styles.container, appStyles.shadow, styleContainer, style]}
      onPress={() => onPress?.(item)}
      onLongPress={() => onLongPress?.(item)}
    >
      <ImageBackground style={[styles.pre, stylePre]} source={sourceFromImage(item.details.Image)}>
        <View style={[styles.tableContainer, styleDarken]}>
          <Label type="cap" color={'white'}>
            Table
          </Label>
          <Label type="h3" color={'white'}>
            {item.details.Location}
          </Label>
        </View>
        <View style={[styles.areaIndicator, styleAreaIndicator]} />
      </ImageBackground>

      <View style={styles.main}>
        <Label style={styles.title} type="h3">
          {item.details.DisplayName}
        </Label>
        <Label type="h4" variant="narrow">
          {item.details.ShortDescription}
        </Label>
        <Label style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
          {item.details.State}
        </Label>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  transparent: {
    opacity: 0.4,
  },
  container: {
    minHeight: 80,
    marginVertical: 15,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  pre: {
    overflow: 'hidden',
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableContainer: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 5,
  },
  main: {
    flex: 1,
    padding: 12,
  },
  title: {
    flex: 1,
  },
  tag: {
    textAlign: 'right',
  },
})
