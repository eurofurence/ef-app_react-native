import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Image } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { sourceFromImage } from '@/components/generic/atoms/Image.common'
import { TableRegistrationRecord } from '@/context/data/types.api'
import * as Linking from 'expo-linking'

export type ArtistsAlleyStatusProps = {
  data: TableRegistrationRecord
  canDelete: boolean
  onAccept: () => void
  onReject: () => void
  onDelete: () => void
}

export const ArtistsAlleyReview = ({ data, canDelete, onAccept, onReject, onDelete }: ArtistsAlleyStatusProps) => {
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'review' })
  const { t: tAccessibility } = useTranslation('ArtistsAlley', { keyPrefix: 'accessibility' })
  const backgroundStyle = useThemeBackground('background')

  return (
    <View style={styles.container}>
      <Label type="para" className="mt-5 mb-10">
        {data.State === 'Pending' ? t('explanation_status_pending') : data.State === 'Rejected' ? t('explanation_status_rejected') : t('explanation_status_accepted')}
      </Label>
      <Label type="caption">{t('nickname_reg_id_label')}</Label>
      <Label type="h3" className="mb-5">
        {data.OwnerUsername} ({data.OwnerRegSysId})
      </Label>
      <Label type="caption">{t('display_name_label')}</Label>
      <Label type="h3" className="mb-5">
        {data.DisplayName}
      </Label>
      <Label type="caption">{t('website_url_label')}</Label>
      <Label
        type="h3"
        className="mb-5"
        onPress={() => Linking.openURL(data.WebsiteUrl)}
        accessibilityRole="link"
        accessibilityLabel={tAccessibility('website_link', { url: data.WebsiteUrl })}
        accessibilityHint={tAccessibility('website_link_hint')}
      >
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
      <Label
        type="h3"
        className="mb-5"
        onPress={() => Linking.openURL(`https://t.me/${data.TelegramHandle.replace('@', '')}`)}
        accessibilityRole="link"
        accessibilityLabel={tAccessibility('telegram_link', { handle: data.TelegramHandle })}
        accessibilityHint={tAccessibility('telegram_link_hint')}
      >
        {data.TelegramHandle}
      </Label>
      <Label type="caption">{t('submission_image_label')}</Label>
      <View style={[styles.imageContainer, backgroundStyle]}>
        <Image
          style={{ aspectRatio: (data.Image?.Width ?? 1) / (data.Image?.Height ?? 1) }}
          contentFit={undefined}
          source={sourceFromImage(data.Image)}
          placeholder={null}
          accessibilityRole="image"
          accessibilityLabel={tAccessibility('submission_image', { displayName: data.DisplayName })}
        />
      </View>

      <View style={styles.buttons}>
        {data.State === 'Pending' ? (
          <>
            <Button onPress={onAccept} accessibilityLabel={tAccessibility('accept_button')} accessibilityHint={tAccessibility('accept_button_hint')}>
              {t('accept_request')}
            </Button>

            <Button onPress={onReject} accessibilityLabel={tAccessibility('reject_button')} accessibilityHint={tAccessibility('reject_button_hint')}>
              {t('reject_request')}
            </Button>
          </>
        ) : null}

        {canDelete ? (
          <>
            <Button onPress={onDelete} outline={true} accessibilityLabel={tAccessibility('delete_button')} accessibilityHint={tAccessibility('delete_button_hint')}>
              {t('delete_registration')}
            </Button>
          </>
        ) : null}
      </View>
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
  buttons: {
    marginTop: 30,
    gap: 15,
  },
})
