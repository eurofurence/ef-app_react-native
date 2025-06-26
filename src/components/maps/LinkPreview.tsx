import { extractOgMeta } from '@/util/extractOgMeta'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type LinkPreviewProps = {
  url: string
  onPress: () => void
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url, onPress }) => {
  const { SCREEN_WIDTH, IMAGE_WIDTH, IMAGE_HEIGHT } = React.useMemo(() => {
    const SCREEN_WIDTH = Dimensions.get('window').width
    const IMAGE_WIDTH = SCREEN_WIDTH - 32 // 16px margin on each side
    const IMAGE_HEIGHT = Math.round((IMAGE_WIDTH * 9) / 16) // 16:9 aspect ratio
    return { SCREEN_WIDTH, IMAGE_WIDTH, IMAGE_HEIGHT }
  }, [Dimensions.get('window').width])

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOgImage = async () => {
      try {
        const res = await fetch(url)
        const html = await res.text()
        const meta = extractOgMeta(html)
        setImageUrl(meta.image || null)
      } catch {
        setImageUrl(null)
      } finally {
        setLoading(false)
      }
    }
    fetchOgImage()
  }, [url])

  if (loading) return <ActivityIndicator style={{ height: IMAGE_HEIGHT, width: IMAGE_WIDTH }} />
  if (!imageUrl)
    return (
      <View style={[styles.cardContainer, { width: IMAGE_WIDTH, height: IMAGE_HEIGHT, justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No preview available</Text>
      </View>
    )

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.cardContainer, { width: IMAGE_WIDTH, height: IMAGE_HEIGHT }]}>
      <Image source={{ uri: imageUrl }} style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT, resizeMode: 'cover' }} />
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
