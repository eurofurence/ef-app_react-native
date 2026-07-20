import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useCache } from '@/context/data/Cache'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { vibrateAfter } from '@/util/vibrateAfter'

import { Image, type ImageProps } from '../atoms/Image'
import { Label } from '../atoms/Label'

export type ComingSoonProps = {
  image: ImageProps['source']
  title: string
  text: string
}

export const ComingSoon = ({ image, title, text }: ComingSoonProps) => {
  const insets = useSafeAreaInsets()
  const backgroundSurface = useThemeBackground('surface')
  const { isSynchronizing, synchronize } = useCache()
  const { t: a11y } = useTranslation('Accessibility')

  return (
    <ScrollView
      style={[StyleSheet.absoluteFill, backgroundSurface]}
      contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl
          refreshing={isSynchronizing}
          onRefresh={() => vibrateAfter(synchronize())}
          accessibilityLabel={a11y('pull_to_refresh')}
          accessibilityHint={a11y('pull_to_refresh_hint')}
        />
      }
    >
      <View
        style={styles.content}
        accessibilityRole='text'
        accessibilityLabel={`${title}. ${text}`}
      >
        <Image style={styles.image} source={image} contentFit='contain' />
        <Label type='h1' variant='middle'>
          {title}
        </Label>
        <Label type='regular' variant='middle' style={styles.text}>
          {text}
        </Label>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  image: {
    height: 240,
    aspectRatio: 1,
    maxWidth: '100%',
  },
  text: {
    maxWidth: 360,
  },
})
