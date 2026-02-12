import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Image } from '@/components/generic/atoms/Image'
import { sourceFromImage } from '@/components/generic/atoms/Image.common'
import { Label } from '@/components/generic/atoms/Label'
import type { TableRegistrationRecord } from '@/context/data/types.api'
import type { ArtistAlleyDetails } from '@/context/data/types.details'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

import { handleExternalLink } from '../ExternalLink'

export type ArtistsAlleyContentProps = {
  data: ArtistAlleyDetails | TableRegistrationRecord
}

export const ArtistsAlleyContent = ({ data }: ArtistsAlleyContentProps) => {
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'review' })
  const { t: a11y } = useTranslation('Accessibility')
  const { t: tAccessibility } = useTranslation('ArtistsAlley', {
    keyPrefix: 'accessibility',
  })
  const backgroundStyle = useThemeBackground('background')

  return (
    <View style={styles.container}>
      <Label type='caption'>{t('display_name_label')}</Label>
      <Label type='h3' className='mb-5'>
        {data.DisplayName}
      </Label>
      <Label type='caption'>{t('website_url_label')}</Label>
      <Label
        type='h3'
        className='mb-5'
        onPress={() =>
          handleExternalLink(data.WebsiteUrl, {
            title: a11y('external_link_no_prompt'),
            body: a11y('outside_link'),
            confirmText: a11y('confirm'),
            cancelText: a11y('cancel'),
          })
        }
        accessibilityRole='link'
        accessibilityLabel={tAccessibility('website_link', {
          url: data.WebsiteUrl,
        })}
        accessibilityHint={tAccessibility('website_link_hint')}
      >
        {data.WebsiteUrl}
      </Label>
      <Label type='caption'>{t('short_description_label')}</Label>
      <Label type='h3' className='mb-5'>
        {data.ShortDescription}
      </Label>
      <Label type='caption'>{t('location_label')}</Label>
      <Label type='h3' className='mb-5'>
        {data.Location}
      </Label>
      <Label type='caption'>{t('telegram_handle_label')}</Label>
      <Label
        type='h3'
        className='mb-5'
        onPress={() =>
          handleExternalLink(
            `https://t.me/${data.TelegramHandle.replace('@', '')}`,
            {
              title: a11y('external_link_no_prompt'),
              body: a11y('outside_link'),
              confirmText: a11y('confirm'),
              cancelText: a11y('cancel'),
            }
          )
        }
        accessibilityRole='link'
        accessibilityLabel={tAccessibility('telegram_link', {
          handle: data.TelegramHandle,
        })}
        accessibilityHint={tAccessibility('telegram_link_hint')}
      >
        {data.TelegramHandle}
      </Label>
      <Label type='caption'>{t('submission_image_label')}</Label>
      <View style={[styles.imageContainer, backgroundStyle]}>
        <Image
          style={[
            styles.image,
            {
              aspectRatio: (data.Image?.Width ?? 1) / (data.Image?.Height ?? 1),
            },
          ]}
          contentFit={undefined}
          source={sourceFromImage(data.Image)}
          placeholder={null}
          accessibilityRole='image'
          accessibilityLabel={tAccessibility('submission_image', {
            displayName: data.DisplayName,
          })}
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
