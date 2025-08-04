import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Image } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { sourceFromImage } from '@/components/generic/atoms/Image.common'
import { TableRegistrationRecord } from '@/context/data/types.api'

export type ArtistsAlleyStatusProps = {
  data: TableRegistrationRecord
  onEdit: () => void
  onCheckOut: () => void
}

export const ArtistsAlleyStatus = ({ data, onEdit, onCheckOut }: ArtistsAlleyStatusProps) => {
  // Get translation function.
  const { t } = useTranslation('ArtistsAlley')
  const backgroundStyle = useThemeBackground('background')

  return (
    <View style={styles.container}>
      <Label type="para" className="mt-5 mb-10">
        {data.State === 'Pending' ? t('explanation_status_pending') : data.State === 'Rejected' ? t('explanation_status_rejected') : t('explanation_status_accepted')}
      </Label>
      <Label type="caption">{t('display_name_label')}</Label>
      <Label type="h3" className="mb-5">
        {data.DisplayName}
      </Label>
      <Label type="caption">{t('website_url_label')}</Label>
      <Label type="h3" className="mb-5">
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
      <Label type="h3" className="mb-5">
        {data.TelegramHandle}
      </Label>
      <Label type="caption">{t('submission_image_label')}</Label>
      <View style={[styles.imageContainer, backgroundStyle]}>
        <Image style={{ aspectRatio: data.Image.Width / data.Image.Height }} contentFit={undefined} source={sourceFromImage(data.Image)} placeholder={null} />
      </View>

      <Button style={styles.button} onPress={onEdit}>
        {data.State === 'Pending' ? t('edit_request') : t('new_request')}
      </Button>

      {data.State === 'Accepted' ? (
        <Button style={styles.button} onPress={onCheckOut}>
          {t('check_out')}
        </Button>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  imageContainer: {
    alignSelf: 'stretch',
    height: undefined,
    marginTop: 6,
    marginBottom: 16,
  },
  button: {
    marginTop: 30,
  },
})
