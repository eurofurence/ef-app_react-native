import { extractOgMeta } from '@/util/extractOgMeta'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, ViewStyle } from 'react-native'
import { Pressable } from '@/components/generic/Pressable'
import axios from 'axios'
import { Image } from '@/components/generic/atoms/Image'

type LinkPreviewProps = {
  url: string
  onPress: () => void
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

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url, onPress }) => {
  const { width: screenWidth } = useWindowDimensions()
  const styleSize: ViewStyle = useMemo(() => {
    const width = screenWidth - 32 // 16px margin on each side
    const height = Math.round((width * 9) / 16) // 16:9 aspect ratio
    return { width, height, justifyContent: 'center', alignItems: 'center' }
  }, [screenWidth])

  const { data: ogMeta, isLoading, isError } = useOgMeta(url)
  const isDisabled = isError || !ogMeta?.image

  return (
    <Pressable onPress={onPress} activeOpacity={0.8} style={[styles.cardContainer, styleSize]} disabled={isLoading || isDisabled}>
      {isLoading ? <ActivityIndicator /> : isDisabled ? <Text>No preview available</Text> : <Image source={{ uri: ogMeta.image }} style={styles.image} />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },

  image: {
    resizeMode: 'cover',
    flex: 1,
    alignSelf: 'stretch',
  },
})
