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

export type ArtistsAlleyCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  item: TableRegistrationRecord
  onPress?: (item: TableRegistrationRecord) => void
  onLongPress?: (item: TableRegistrationRecord) => void
}

export const ArtistsAlleyCard: FC<ArtistsAlleyCardProps> = ({ containerStyle, style, item, onPress, onLongPress }) => {
  // Dependent and independent styles.
  const styleContainer = useThemeBackground('background')
  const stylePre = useThemeBackground('primary')
  const styleAreaIndicator = useThemeBackground(stateToBackground[item.State])
  const styleDarken = useThemeBackground('darken')

  return (
    <TouchableOpacity
      containerStyle={containerStyle}
      style={[styles.container, appStyles.shadow, styleContainer, style]}
      onPress={() => onPress?.(item)}
      onLongPress={() => onLongPress?.(item)}
    >
      <ImageBackground style={[styles.pre, stylePre]} source={sourceFromImage(item.Image)}>
        <View style={[styles.tableContainer, styleDarken]}>
          <Label type="cap" color={'white'}>
            Table
          </Label>
          <Label type="h3" color={'white'}>
            {item.Location}
          </Label>
        </View>
        <View style={[styles.areaIndicator, styleAreaIndicator]} />
      </ImageBackground>

      <View style={styles.main}>
        <Label style={styles.title} type="h3">
          {item.DisplayName}
        </Label>
        <Label type="h4" variant="narrow">
          {item.ShortDescription}
        </Label>
        <Label style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
          {item.State}
        </Label>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
