import { StyleSheet } from 'react-native'

export const appStyles = StyleSheet.create({
  /**
   * Verified shadow to be used across iOS and Android devices.
   */
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
