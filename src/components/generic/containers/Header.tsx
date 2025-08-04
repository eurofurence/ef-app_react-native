import React, { FC, PropsWithChildren } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { router } from 'expo-router'
import { Continuous } from '../atoms/Continuous'
import { Icon, IconNames } from '../atoms/Icon'
import { Label } from '../atoms/Label'
import { Row } from './Row'
import { useThemeBackground, useThemeBorder, useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { useToastMessages } from '@/context/ui/ToastContext'
import { Toast } from '@/components/Toast'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Pressable, PressableProps } from '@/components/generic/Pressable'

const iconSize = 26
const iconPad = 6

export type HeaderProps = PropsWithChildren<
  | {
      style?: ViewStyle
      loading?: boolean
    }
  | {
      style?: ViewStyle
      secondaryIcon: IconNames
      secondaryPress: () => void
      loading?: boolean
    }
>

/**
 * Hit slop for the back button.
 */
const backHitSlop: PressableProps['hitSlop'] = {
  left: 15,
  top: 15,
  bottom: 15,
  right: 160,
}

/**
 * Hit slop for the secondary button if present.
 */
const secondaryHitSlop: PressableProps['hitSlop'] = {
  right: 15,
  top: 15,
  bottom: 15,
  left: 50,
}

export const Header: FC<HeaderProps> = (props) => {
  const insets = useSafeAreaInsets()
  const colorValue = useThemeColorValue('text')
  const styleBackground = useThemeBackground('background')
  const styleBorder = useThemeBorder('darken')
  const toastMessages = useToastMessages(5)
  return (
    <Row style={[styles.container, styleBackground, styleBorder, props.style, { paddingTop: styles.container.paddingTop + insets.top }]} type="center" variant="spaced">
      <Pressable hitSlop={backHitSlop} style={styles.back} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
        <Icon name="chevron-left" size={iconSize} color={colorValue} />
      </Pressable>

      <Label style={styles.text} type="lead" ellipsizeMode="tail" numberOfLines={1}>
        {props.children}
      </Label>

      {/* Optional secondary action. */}
      {!('secondaryIcon' in props) ? null : (
        <Pressable hitSlop={secondaryHitSlop} style={styles.secondary} onPress={() => props.secondaryPress()} accessibilityRole="button">
          <Icon name={props.secondaryIcon} size={iconSize} color={colorValue} />
        </Pressable>
      )}

      {
        // Loading header. Explicitly given as false, not loading.
        props.loading === false ? (
          <Continuous style={styles.loading} active={false} />
        ) : // Explicitly given as true, loading.
        props.loading === true ? (
          <Continuous style={styles.loading} active={true} />
        ) : // Not given, therefore no element.
        null
      }

      {!toastMessages.length ? null : (
        <View style={styles.toasts}>
          <View style={styles.toastsInner}>
            {[...toastMessages].reverse().map((toast) => (
              <Toast key={toast.id} {...toast} loose={false} />
            ))}
          </View>
        </View>
      )}
    </Row>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  text: {
    flex: 1,
    justifyContent: 'center',
  },
  back: {
    marginLeft: -iconPad,
    width: iconSize + iconPad,
    height: iconSize + iconPad,
    justifyContent: 'center',
    zIndex: 20,
  },
  secondary: {
    width: iconSize + iconPad,
    height: iconSize + iconPad,
    marginRight: -iconPad,
    justifyContent: 'center',
    zIndex: 20,
  },
  loading: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },
  toasts: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  toastsInner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
})
