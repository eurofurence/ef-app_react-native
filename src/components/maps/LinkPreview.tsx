import { extractOgMeta } from '@/util/extractOgMeta'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type LinkPreviewProps = {
  url: string
  onPress: () => void
}

async function fetchOgMeta(url: string, signal?: AbortSignal) {
  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
  }
  const html = await res.text()
  return extractOgMeta(html)
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
  const screenWidth = Dimensions.get('window').width
  const { IMAGE_WIDTH, IMAGE_HEIGHT } = useMemo(() => {
    const SCREEN_WIDTH = screenWidth
    const IMAGE_WIDTH = SCREEN_WIDTH - 32 // 16px margin on each side
    const IMAGE_HEIGHT = Math.round((IMAGE_WIDTH * 9) / 16) // 16:9 aspect ratio
    return { SCREEN_WIDTH, IMAGE_WIDTH, IMAGE_HEIGHT }
  }, [screenWidth])

  const { data: ogMeta, isLoading, isError } = useOgMeta(url)

  if (isLoading) return <ActivityIndicator style={{ height: IMAGE_HEIGHT, width: IMAGE_WIDTH }} />

  if (isError || !ogMeta?.image)
    return (
      <View style={[styles.cardContainer, { width: IMAGE_WIDTH, height: IMAGE_HEIGHT, justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No preview available</Text>
      </View>
    )

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.cardContainer, { width: IMAGE_WIDTH, height: IMAGE_HEIGHT }]}>
      <Image source={{ uri: ogMeta.image }} style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT, resizeMode: 'cover' }} />
    </TouchableOpacity>
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
})
