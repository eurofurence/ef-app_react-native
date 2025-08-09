import { extractOgMeta } from '@/util/extractOgMeta'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'
import { ActivityIndicator, StyleProp, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Image } from '@/components/generic/atoms/Image'
import { useThemeBackground, useThemeBorder } from '@/hooks/themes/useThemeHooks'
import { Label } from '@/components/generic/atoms/Label'

type LinkPreviewProps = {
  url: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

async function fetchOgMeta(url: string, signal?: AbortSignal) {
  return await axios
    .get(url, { signal, responseType: 'text' })
    .then((res) => res.data)
    .then((text) => extractOgMeta(text))
}

function useOgMeta(url: string) {
  return useQuery({
    queryKey: ['og-meta', url],
    queryFn: ({ signal }) => fetchOgMeta(url, signal),
    placeholderData: keepPreviousData,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url, onPress, style }) => {
  const { t } = useTranslation('Maps')
  const { data: ogMeta, isLoading, isError } = useOgMeta(url)
  const isDisabled = isError || !ogMeta?.image
  const styleBackground = useThemeBackground('background')
  const styleBorder = useThemeBorder('soften')

  const getAccessibilityLabel = () => {
    if (isLoading) return t('accessibility.link_preview_loading')
    if (isDisabled) return t('accessibility.link_preview_unavailable')
    return t('accessibility.link_preview_available', { url })
  }

  const getAccessibilityHint = () => {
    if (isLoading || isDisabled) return undefined
    return t('accessibility.link_preview_hint')
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.cardContainer, styleBackground, styleBorder, style]}
      disabled={isLoading || isDisabled}
      accessibilityRole="button"
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={getAccessibilityHint()}
      accessibilityState={{ disabled: isLoading || isDisabled }}
    >
      {isLoading ? (
        <ActivityIndicator
          accessibilityLabel={t('accessibility.loading_preview')}
          importantForAccessibility="no"
        />
      ) : isDisabled ? (
        <Label
          accessibilityLabel={t('accessibility.no_preview_available')}
          importantForAccessibility="no"
        >
          {t('preview_unavailable')}
        </Label>
      ) : (
        <Image
          source={{ uri: ogMeta.image }}
          style={styles.image}
          accessibilityRole="image"
          importantForAccessibility="no"
        />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    height: undefined,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 16 / 9,
  },

  image: {
    resizeMode: 'cover',
    flex: 1,
    alignSelf: 'stretch',
  },
})