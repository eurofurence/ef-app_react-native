import SearchPlus from '@expo/vector-icons/FontAwesome5'
import { useIsFocused } from '@react-navigation/core'
import React, { FC, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, StyleSheet, TextInput, View, ViewStyle } from 'react-native'

import { withAlpha } from '@/context/Theme'
import { useThemeBackground, useThemeColor, useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { labelTypeStyles } from './Label'

export type SearchProps = {
  style?: ViewStyle
  filter: string
  setFilter: (value: string) => void
  placeholder?: string
  submit?: () => void
}

export const Search: FC<SearchProps> = ({ style, filter, setFilter, placeholder, submit }) => {
  const { t } = useTranslation('Search')
  const styleLighten = useThemeBackground('inverted')
  const styleText = useThemeColor('invText')
  const colorText = useThemeColorValue('invText')

  // Use ref to track current filter without causing effect re-runs
  const filterRef = useRef(filter)
  filterRef.current = filter

  // Connect clearing search on back if focused. // TODO: Test if this feels nice.
  const isFocused = useIsFocused()
  useEffect(() => {
    if (!isFocused) return

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (filterRef.current.length > 0) {
        setFilter('')
        return true
      }
      return false
    })
    return () => subscription.remove()
  }, [isFocused, setFilter])

  return (
    <View style={[styles.container, styleLighten, style]}>
      <SearchPlus name="search" size={18} color={colorText} style={styles.icon} />
      <TextInput
        style={[styles.searchField, styleText, labelTypeStyles.regular]}
        value={filter}
        onChangeText={setFilter}
        onSubmitEditing={submit}
        placeholder={placeholder ?? t('placeholder')}
        placeholderTextColor={withAlpha(colorText, 0.6)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: 'white', // You can replace this with dynamic theming
  },
  icon: {
    marginRight: 8,
  },
  searchField: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 0,
  },
})
