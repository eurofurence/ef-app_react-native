import { useIsFocused } from '@react-navigation/core'
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import {
  BackHandler,
  Platform,
  type StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import {
  useThemeBackground,
  useThemeBorder,
} from '@/hooks/themes/useThemeHooks'

import { Continuous } from '../atoms/Continuous'
import type { IconNames } from '../atoms/Icon'

import { Tab } from './Tab'

/**
 * Arguments to the tabs.
 */
export type TabsProps = {
  /**
   * Style used on the container of the tabs.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Safe area padding if applicable.
   */
  padding?: number

  /**
   * If given, tabs that are laid out before the more/less button.
   */
  tabs: {
    /**
     * The icon to display.
     */
    icon: IconNames

    /**
     * Tab style property.
     */
    style?: StyleProp<ViewStyle>

    /**
     * The name of the tab.
     */
    text: string

    /**
     * True if to be rendered as active.
     */
    active?: boolean

    /**
     * If true or node, indicator will be presented over this tab.
     */
    indicate?: boolean | ReactNode

    /**
     * If given, invoked when the tab is pressed.
     */
    onPress?: () => void
  }[]

  /**
   * Text to display for opening the menu.
   */
  textMore?: string

  /**
   * Text to display for closing the menu.
   */
  textLess?: string

  /**
   * If true or node, indicator will be presented over the more button.
   */
  indicateMore?: true | ReactNode

  /**
   * True if activity should be indicated.
   */
  activity?: boolean

  /**
   * If given, a notice element on top of the tabs.
   */
  notice?: string | ReactNode

  /**
   * The content to render in the more-area.
   */
  children?: ReactNode
}

/**
 * Operations provided by the navigator.
 */
export type TabsRef = {
  /**
   * Closes the more-area with animations.
   */
  close(): boolean

  /**
   * Opens the more-area with animations.
   */
  open(): boolean

  /**
   * Closes the more-area immediately.
   */
  closeImmediately(): boolean
}

/**
 * At what percentage is the drawer considered open.
 */
const openThreshold = 0.35

/**
 * How much must the drawer be dragged to flip open.
 */
const openDragThreshold = 40

/**
 * How much must the drawer be dragged to flip closed.
 */
const closeDragThreshold = 80

/**
 * Animation configuration.
 */
const springConfig = {
  damping: 15,
  stiffness: 100,
  mass: 1,
} as const

/**
 * A row of tabs and a "more" button.
 *
 * Adds a child under it containing the more-area. When opened by pressing
 * or dragging, translates it into view and overlays the containing view with
 * a semi-opaque layer.
 */
export const Tabs = forwardRef<TabsRef, TabsProps>(
  (
    {
      style,
      padding = 0,
      tabs,
      textMore = 'More',
      textLess = 'Less',
      indicateMore,
      activity,
      notice,
      children,
    },
    ref
  ) => {
    // Computed styles.
    const styleDismiss = useThemeBackground('darken')
    const fillBackground = useThemeBackground('background')
    const bordersDarken = useThemeBorder('darken')

    // Get safe area paddings.
    const padMenu = useMemo((): ViewStyle => {
      return { height: padding }
    }, [padding])

    // Animation values
    const height = useSharedValue<number>(300)
    const offset = useSharedValue<number>(0)
    const startOffset = useSharedValue<number>(0)
    const animating = useSharedValue<boolean>(false)

    // Animation derived values.
    const [isOpen, setIsOpen] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    useAnimatedReaction(
      () => offset.value > openThreshold,
      (currentValue, previousValue) => {
        if (previousValue !== currentValue) {
          runOnJS(setIsOpen)(currentValue)
        }
      }
    )
    useAnimatedReaction(
      () => animating.value,
      (currentValue, previousValue) => {
        if (previousValue !== currentValue) {
          runOnJS(setIsAnimating)(currentValue)
        }
      }
    )

    // Derive opa,city from offset
    const dynamicDismiss = useAnimatedStyle(
      () => ({
        opacity: offset.value,
        transform: [
          {
            translateY: offset.value === 0 ? 99999 : 0,
          },
        ],
      }),
      [offset]
    )

    // Derive transformation from offset
    const dynamicContainer = useAnimatedStyle(
      () => ({
        transform: [{ translateY: -offset.value * height.value }],
      }),
      [offset, height]
    )

    // State change handlers
    const open = useCallback(() => {
      if (isOpen) return false
      animating.set(true)
      offset.value = withSpring(1, springConfig, () => {
        animating.set(false)
      })
      return true
    }, [animating, isOpen, offset])

    const close = useCallback(() => {
      if (!isOpen) return false
      animating.set(true)
      offset.value = withSpring(0, springConfig, () => {
        animating.set(false)
      })
      return true
    }, [animating, isOpen, offset])

    const closeImmediately = useCallback(() => {
      if (!isOpen) return false
      offset.value = 0
      return true
    }, [isOpen, offset])

    // Handle to invoke internal mutations from outside if needed.
    useImperativeHandle(ref, () => ({ open, close, closeImmediately }), [
      open,
      close,
      closeImmediately,
    ])

    // Gesture handling
    const gesture = useMemo(
      () =>
        Gesture.Pan()
          .onBegin(() => {
            startOffset.value = offset.value
            cancelAnimation(offset)
          })
          .onUpdate((e) => {
            const newOffset = -e.translationY / height.value + startOffset.value
            offset.value = Math.max(0, Math.min(newOffset, 1))
          })
          .onEnd((e) => {
            // Get state and gesture properties (i.e., if criteria are matched.
            const isOpen = offset.get() > openThreshold
            const drawnClosed = e.translationY > closeDragThreshold
            const drawnOpen = e.translationY < -openDragThreshold

            // Target. If open and drawn closed, close. If closed and drawn open, open. Otherwise fall back to original state.
            let target: 0 | 1
            if (isOpen && drawnClosed) target = 0
            else if (!isOpen && drawnOpen) target = 1
            else target = isOpen ? 1 : 0

            animating.set(true)
            offset.value = withSpring(target, springConfig, () => {
              animating.set(false)
            })
          }),
      [animating, height, offset, startOffset]
    )

    const isFocused = useIsFocused()

    // Connect to back handler
    useEffect(() => {
      if (Platform.OS === 'web') return
      if (!isFocused) return
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => close() ?? false
      )
      return () => subscription.remove()
    }, [close, isFocused])

    return (
      <>
        <Animated.View style={[styles.dismiss, styleDismiss, dynamicDismiss]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={close}
            accessibilityRole='button'
            accessibilityLabel='Close'
            activeOpacity={1}
          >
            <View style={StyleSheet.absoluteFill} />
          </TouchableOpacity>
        </Animated.View>

        <GestureDetector gesture={gesture}>
          <Animated.View style={dynamicContainer}>
            {notice && (
              <View style={styles.zeroFromTop}>
                <View style={styles.zeroFromBottom}>{notice}</View>
              </View>
            )}

            <View
              style={[styles.tabs, bordersDarken, fillBackground, style]}
              pointerEvents={isAnimating ? 'none' : 'auto'}
            >
              {tabs?.map((tab) => (
                <Tab
                  key={tab.text}
                  style={tab.style}
                  icon={tab.icon}
                  text={tab.text}
                  active={tab.active}
                  indicate={tab.indicate}
                  onPress={tab.onPress}
                />
              ))}

              <Tab
                icon={isOpen ? 'arrow-down-circle' : 'menu'}
                text={isOpen ? textLess : textMore}
                onPress={isOpen ? close : open}
                indicate={indicateMore}
              />

              <Continuous style={styles.activity} active={activity} />
            </View>

            <View
              style={[styles.content, bordersDarken, fillBackground]}
              onLayout={(e) =>
                height.set((current) => e.nativeEvent.layout.height ?? current)
              }
            >
              {children}
            </View>
          </Animated.View>
        </GestureDetector>

        <View style={[padMenu, fillBackground]}></View>
      </>
    )
  }
)

Tabs.displayName = 'Tabs'

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  dismiss: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  zeroFromTop: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
  zeroFromBottom: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  activity: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
  content: {
    position: 'absolute',
    left: 0,
    top: '100%',
    right: 0,
    borderTopWidth: 1,
  },
})
