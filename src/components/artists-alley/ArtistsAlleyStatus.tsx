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
  onCancel: () => void
}

export const ArtistsAlleyStatus = ({ data, onEdit, onCheckOut, onCancel }: ArtistsAlleyStatusProps) => {
  const { t } = useTranslation('ArtistsAlley')
  const { t: tAccessibility } = useTranslation('ArtistsAlley', { keyPrefix: 'accessibility' })
  const backgroundStyle = useThemeBackground('background')

  const statusText = (() => {
    switch (data.State) {
      case 'Pending':
        return t('explanation_status_pending')
      case 'Rejected':
        return t('explanation_status_pending')
      case 'Published':
      case 'Accepted':
        return t('explanation_status_accepted')
      case 'CheckedOut':
        return t('explanation_status_checkedout')
      default:
        return ''
    }
  })()

  return (
    <View>
      <Label type="compact" className="mt-5 mb-5" accessibilityRole="text" accessibilityLabel={`Current status: ${statusText}`}>
        {statusText}
      </Label>
      {data.State === 'Accepted' ? (
        <Button onPress={onCheckOut} icon="exit-run" accessibilityLabel={tAccessibility('checkout_button')} accessibilityHint={tAccessibility('checkout_button_hint')}>
          {t('check_out')}
        </Button>
      ) : (
        <Button
          onPress={onEdit}
          accessibilityLabel={data.State === 'Pending' ? tAccessibility('edit_button') : tAccessibility('new_request_button')}
          accessibilityHint={data.State === 'Pending' ? tAccessibility('edit_button_hint') : tAccessibility('new_request_button_hint')}
        >
          {data.State === 'Pending' ? t('edit_request') : t('new_request')}
        </Button>
      )}
      <Label type="caption" className="mt-5">
        {t('display_name_label')}
      </Label>
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
      <Label type="caption" className="mb-2">
        {t('submission_image_label')}
      </Label>
      <View style={[styles.imageContainer, backgroundStyle]} className="mb-5">
        <Image
          style={{ aspectRatio: data.Image.Width / data.Image.Height }}
          contentFit={undefined}
          source={sourceFromImage(data.Image)}
          placeholder={null}
          accessibilityRole="image"
          accessibilityLabel={tAccessibility('submission_image', { displayName: data.DisplayName })}
        />
      </View>

      {data.State === 'Pending' ? (
        <Button onPress={onCancel} className="mt-3" accessibilityLabel={tAccessibility('cancel_button')} accessibilityHint={tAccessibility('cancel_button_hint')}>
          {t('cancel_request')}
        </Button>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    alignSelf: 'stretch',
    height: undefined,
  },
})
