import { StyleSheet } from 'react-native'

export const appStyles = StyleSheet.create({
  /**
   * Verified shadow to be used across iOS and Android devices.
   */
  shadow: {
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },

  /**
   * Absolute positioning only, use in conjuction with insets.
   */
  abs: {
    position: 'absolute',
  },

  /**
   * Adds sufficient trailer space as padding.
   */
  trailer: {
    paddingBottom: 100,
  },

  minTouchSize: {
    minWidth: 44,
    minHeight: 44,
  },
})
