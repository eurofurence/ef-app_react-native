import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Image } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import { sourceFromImage } from '@/components/generic/atoms/Image.common'
import { TableRegistrationRecord } from '@/context/data/types.api'
import * as Linking from 'expo-linking'
import { ArtistAlleyDetails } from '@/context/data/types.details'

export type ArtistsAlleyContentProps = {
  data: ArtistAlleyDetails | TableRegistrationRecord
}

export const ArtistsAlleyContent = ({ data }: ArtistsAlleyContentProps) => {
  // Get translation function.
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'review' })
  const backgroundStyle = useThemeBackground('background')

  return (
    <View style={styles.container}>
      <Label type="caption">{t('display_name_label')}</Label>
      <Label type="h3" className="mb-5">
        {data.DisplayName}
      </Label>
      <Label type="caption">{t('website_url_label')}</Label>
      <Label type="h3" className="mb-5" onPress={() => Linking.openURL(data.WebsiteUrl)}>
        {data.WebsiteUrl}
      </Label>
      <Label type="caption">{t('short_description_label')}</Label>
      <Label type="h3" className="mb-5">
        {data.ShortDescription}
      </Label>
      <Label type="caption">{t('location_label')}</Label>
      <Label type="h3" className="mb-5">
        {data.Location}
      </Label>
      <Label type="caption">{t('telegram_handle_label')}</Label>
      <Label type="h3" className="mb-5" onPress={() => Linking.openURL(`https://t.me/${data.TelegramHandle.replace('@', '')}`)}>
        {data.TelegramHandle}
      </Label>
      <Label type="caption">{t('submission_image_label')}</Label>
      <View style={[styles.imageContainer, backgroundStyle]}>
        <Image
          style={[styles.image, { aspectRatio: (data.Image?.Width ?? 1) / (data.Image?.Height ?? 1) }]}
          contentFit={undefined}
          source={sourceFromImage(data.Image)}
          placeholder={null}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: undefined,
    marginTop: 6,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    minHeight: 200,
    height: undefined,
  },
})
