import SearchPlus from '@expo/vector-icons/FontAwesome5'
import React, { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native'

import { withAlpha } from '@/context/Theme'
import { useThemeBackground, useThemeColor, useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { labelTypeStyles } from './Label'
import { Icon } from '@/components/generic/atoms/Icon'
import { Pressable } from '@/components/generic/Pressable'

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

  return (
    <View style={[styles.container, styleLighten, style]}>
      <SearchPlus name="search" size={18} color={colorText} style={styles.iconSearch} />
      <TextInput
        style={[styles.searchField, styleText, labelTypeStyles.regular]}
        value={filter}
        onChangeText={setFilter}
        onSubmitEditing={submit}
        placeholder={placeholder ?? t('placeholder')}
        placeholderTextColor={withAlpha(colorText, 0.6)}
        accessibilityLabel={t('search_input_label')}
        accessibilityHint={t('search_input_hint')}
      />
      <Pressable hitSlop={15} onPress={() => setFilter('')} accessibilityRole="button" accessibilityLabel="Back">
        <Icon name="close" size={18} color={filter ? colorText : 'transparent'} style={styles.iconClear} />
      </Pressable>
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
  iconSearch: {
    marginRight: 8,
  },
  iconClear: {
    marginLeft: 8,
  },
  searchField: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 0,
  },
})
