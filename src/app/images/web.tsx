import { ReactNativeZoomableView as ZoomableView } from '@openspacelabs/react-native-zoomable-view'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image as ReactImage, StyleSheet, View } from 'react-native'

import { platformShareIcon } from '@/components/generic/atoms/Icon'
import { Image } from '@/components/generic/atoms/Image'
import { Header } from '@/components/generic/containers/Header'
import { minZoomFor, shareImage } from '@/components/images/Images.common'
import { useLocalSearchParams } from 'expo-router'

const viewerPadding = 20

export default function ImageWeb() {
  const { url, title } = useLocalSearchParams<{ url?: string; title?: string }>()
  const { t } = useTranslation('Viewer')
  const [width, setWidth] = useState(-1)
  const [height, setHeight] = useState(-1)

  // Try getting the image size.
  useEffect(() => {
    if (url) {
      ReactImage.getSize(
        url,
        (width, height) => {
          // Gotten successfully.
          setWidth(width)
          setHeight(height)
        },
        () => {
          // Failed, set to 0 so that expo image starts loading.
          setWidth(0)
          setHeight(0)
        }
      )
    }
  }, [url])

  // Determine zoom levels.
  const minZoom = minZoomFor(width, height, viewerPadding)
  const maxZoom = minZoom * 5

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header secondaryIcon={platformShareIcon} secondaryPress={() => title && url && shareImage(url, title)}>
        {title ?? t('unspecified')}
      </Header>

      {/* Require width and height be either gotten successfully or failed. */}
      {/* If failed, image loading will set the size. */}
      {width === -1 || height === -1 ? null : (
        <ZoomableView
          style={styles.viewer}
          contentWidth={width + viewerPadding * 2}
          contentHeight={height + viewerPadding * 2}
          minZoom={minZoom}
          maxZoom={maxZoom}
          initialZoom={minZoom * 1.2}
          bindToBorders={true}
        >
          <View style={{ width, height }}>
            <Image
              style={styles.image}
              allowDownscaling={false}
              contentFit={undefined}
              source={url}
              priority="high"
              onLoad={(event) => {
                setWidth(event.source.width)
                setHeight(event.source.height)
              }}
            />
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
