import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, type ViewStyle } from 'react-native'

import { stateToBackground } from '@/components/artists-alley/utils'
import { Pressable } from '@/components/generic/Pressable'
import type {
  TableRegistrationRecord,
  TableRegistrationRecordStatus,
} from '@/context/data/types.api'
import type { ArtistAlleyDetails } from '@/context/data/types.details'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

import { appStyles } from '../AppStyles'
import { sourceFromImage } from '../generic/atoms/Image.common'
import { ImageBackground } from '../generic/atoms/ImageBackground'
import { Label } from '../generic/atoms/Label'

export type ArtistsAlleyCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  item: ArtistAlleyDetails | TableRegistrationRecord
  onPress?: (item: ArtistAlleyDetails | TableRegistrationRecord) => void
  onLongPress?: (item: ArtistAlleyDetails | TableRegistrationRecord) => void
}

export const ArtistsAlleyCard: FC<ArtistsAlleyCardProps> = ({
  containerStyle,
  style,
  item,
  onPress,
  onLongPress,
}) => {
  const { t: tAccessibility } = useTranslation('ArtistsAlley', {
    keyPrefix: 'accessibility',
  })

  // Dependent and independent styles.
  const styleContainer = useThemeBackground('background')
  const stylePre = useThemeBackground('primary')
  const state: TableRegistrationRecordStatus =
    'State' in item && item.State ? item.State : 'Accepted'
  const styleAreaIndicator = useThemeBackground(stateToBackground[state])
  const styleDarken = useThemeBackground('darken')

  // Create accessibility label with context
  const accessibilityLabel = tAccessibility('card_button', {
    displayName: item.DisplayName,
    location: item.Location,
    status: state,
  })

  return (
    <View style={containerStyle}>
      <Pressable
        style={[styles.container, appStyles.shadow, styleContainer, style]}
        onPress={() => onPress?.(item)}
        onLongPress={() => onLongPress?.(item)}
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={tAccessibility('card_button_hint')}
        accessibilityState={{
          selected: false,
          disabled: false,
        }}
      >
        <ImageBackground
          style={[styles.pre, stylePre]}
          source={sourceFromImage(item.Image)}
        >
          <View style={[styles.tableContainer, styleDarken]}>
            <Label type='cap' color={'white'}>
              Table
            </Label>
            <Label type='h3' color={'white'}>
              {item.Location}
            </Label>
          </View>
          <View style={[styles.areaIndicator, styleAreaIndicator]} />
        </ImageBackground>

        <View style={styles.main}>
          <Label style={styles.title} type='h3'>
            {'OwnerUsername' in item
              ? `${item.OwnerUsername} (${item.OwnerRegSysId}) — `
              : ''}
            {item.DisplayName}
          </Label>
          <Label type='h4' variant='narrow'>
            {item.ShortDescription}
          </Label>
          <Label
            style={styles.tag}
            type='regular'
            ellipsizeMode='head'
            numberOfLines={1}
          >
            {'State' in item ? item.State : ''}
          </Label>
        </View>
      </Pressable>
    </View>
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
