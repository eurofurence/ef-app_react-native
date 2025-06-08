import { ReactNativeZoomableView as ZoomableView } from '@openspacelabs/react-native-zoomable-view'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useLocalSearchParams } from 'expo-router'
import { Image } from '@/components/generic/atoms/Image'
import { Header } from '@/components/generic/containers/Header'
import { platformShareIcon } from '@/components/generic/atoms/Icon'
import { sourceFromImage } from '@/components/generic/atoms/Image.common'
import { useCache } from '@/context/data/Cache'
import { minZoomFor, shareImage } from '@/components/images/Images.common'

const viewerPadding = 20

export default function ImageItem() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { t } = useTranslation('Viewer')
  const { images, imageLocations } = useCache()
  const image = images.dict[id]
  const location = imageLocations[id]
  const title = t(location?.location ?? 'unspecified', { name: location?.title })

  const styleContainer = image ? { width: image.Width, height: image.Height } : null

  // Determine zoom levels.
  const minZoom = minZoomFor(image?.Width ?? 0, image?.Height ?? 0, viewerPadding)
  const maxZoom = minZoom * 5

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header secondaryIcon={platformShareIcon} secondaryPress={() => image && title && shareImage(image.Url, title)}>
        {title}
      </Header>
      {!image ? null : (
        <ZoomableView
          style={styles.viewer}
          contentWidth={image.Width + viewerPadding * 2}
          contentHeight={image.Height + viewerPadding * 2}
          minZoom={minZoom}
          maxZoom={maxZoom}
          initialZoom={minZoom * 1.2}
          bindToBorders={true}
        >
          <View style={styleContainer}>
            <Image style={styles.image} allowDownscaling={false} contentFit={undefined} source={sourceFromImage(image)} priority="high" />
          </View>
        </ZoomableView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    padding: viewerPadding,
  },
})
