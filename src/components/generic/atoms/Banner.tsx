import * as React from 'react'
import { FC } from 'react'
import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { router } from 'expo-router'
import { sourceFromImage } from './Image.common'
import { Image, ImageProps } from './Image'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

import { ImageDetails } from '@/context/data/types'

export type BannerProps = {
    /**
     * The style button.
     */
    style?: ImageProps['style'];

    /**
     * The source image object.
     */
    image?: ImageDetails;

    /**
     * Placeholder to use.
     */
    placeholder?: ImageProps['placeholder'];

    /**
     * If true, this image can be opened and viewed.
     */
    viewable?: boolean;
};

export const Banner: FC<BannerProps> = ({ style, image, placeholder, viewable }) => {
    const aspect = !image ? {} : { aspectRatio: image.Width / image.Height }
    const backgroundStyle = useThemeBackground('background')
    // Do not render if nothing given.
    if (!image) return null
    return (
        <TouchableOpacity
            containerStyle={[styles.container, backgroundStyle]}
            disabled={!viewable}
            onPress={() => {
                if (viewable && image)
                    router.navigate({
                        pathname: '/viewer/[viewerId]',
                        params: { viewerId: image.Id },
                    })
            }}
        >
            <Image style={[styles.image, aspect, style]} contentFit={undefined} source={sourceFromImage(image)} placeholder={placeholder} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: undefined,
    },
    image: {
        width: '100%',
        height: undefined,
    },
})
