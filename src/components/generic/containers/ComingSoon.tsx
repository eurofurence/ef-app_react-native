import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

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

  return (
    <View
      style={[styles.container, backgroundSurface, { paddingTop: insets.top }]}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
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
