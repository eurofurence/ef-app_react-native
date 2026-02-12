import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  type StyleProp,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native'

import { Image } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import {
  useThemeBackground,
  useThemeBorder,
} from '@/hooks/themes/useThemeHooks'
import { extractOgMeta } from '@/util/extractOgMeta'

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

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  url,
  onPress,
  style,
}) => {
  const { t } = useTranslation('Maps')
  const { data: ogMeta, isLoading } = useOgMeta(url)
  const styleBackground = useThemeBackground('background')
  const styleBorder = useThemeBorder('soften')

  const getAccessibilityLabel = () => {
    if (isLoading) return t('accessibility.link_preview_loading')
    if (!ogMeta?.image) return t('accessibility.link_preview_unavailable')
    return t('accessibility.link_preview_available', { url })
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.cardContainer, styleBackground, styleBorder, style]}
      accessibilityRole='button'
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={t('accessibility.link_preview_hint')}
    >
      {isLoading ? (
        <ActivityIndicator
          accessibilityLabel={t('accessibility.loading_preview')}
          importantForAccessibility='no'
        />
      ) : !ogMeta?.image ? (
        <Label
          accessibilityLabel={t('accessibility.no_preview_available')}
          importantForAccessibility='no'
        >
          {t('preview_unavailable')}
        </Label>
      ) : (
        <Image
          source={{ uri: ogMeta.image }}
          style={styles.image}
          accessibilityRole='image'
          importantForAccessibility='no'
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
