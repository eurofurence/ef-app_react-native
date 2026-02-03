import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { setStringAsync } from 'expo-clipboard'
import { openBrowserAsync } from 'expo-web-browser'
import { type FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import {
  shareDealer,
  useToggleFavorite,
} from '@/components/dealers/Dealers.common'
import { Row } from '@/components/generic/containers/Row'
import { conTimeZone } from '@/configuration'
import type { DealerDetails } from '@/context/data/types.details'
import { useToastContext } from '@/context/ui/ToastContext'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'

import { appStyles } from '../AppStyles'
import { handleExternalLink } from '../ExternalLink'
import { Banner } from '../generic/atoms/Banner'
import { FaIcon } from '../generic/atoms/FaIcon'
import { Image } from '../generic/atoms/Image'
import { sourceFromImage } from '../generic/atoms/Image.common'
import { Label } from '../generic/atoms/Label'
import { Section } from '../generic/atoms/Section'
import { Badge } from '../generic/containers/Badge'
import { Button } from '../generic/containers/Button'
import { LinkItem } from '../maps/LinkItem'
import { LinkPreview } from '../maps/LinkPreview'

const DealerCategories = ({ dealer }: { dealer: DealerDetails }) => {
  // Nothing to display for no categories.
  if (!dealer.Categories?.length) return null

  return (
    <View style={dealerCategoriesStyles.container}>
      {dealer.Categories.map((category: string) => {
        const keywords = dealer.Keywords?.[category]
        if (keywords?.length)
          return (
            <View style={dealerCategoriesStyles.category} key={category}>
              <Label type='caption' variant='bold'>
                {category}
              </Label>
              {keywords.map((keyword) => (
                <Label key={keyword}>{keyword}</Label>
              ))}
            </View>
          )
        else
          return (
            <Label key={category} type='caption' variant='bold'>
              {category}
            </Label>
          )
      })}
    </View>
  )
}

const dealerCategoriesStyles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 30,
    marginBottom: 30,
  },
  category: {
    gap: 5,
  },
})

/**
 * Props to the content.
 */
export type DealerContentProps = {
  dealer: DealerDetails

  /**
   * The padding used by the parent horizontally.
   */
  parentPad?: number

  /**
   * True if the dealer was updated.
   */
  updated?: boolean

  /**
   * True if a dedicated share button should be displayed.
   */
  shareButton?: boolean
}

export const DealerContent: FC<DealerContentProps> = ({
  dealer,
  parentPad = 0,
  updated,
  shareButton,
}) => {
  const { t } = useTranslation('Dealer')
  const { t: a11y } = useTranslation('Accessibility')
  const { toast } = useToastContext()
  const now = useNow()

  const avatarBackground = useThemeBackground('text')

  const days = useMemo(
    () =>
      dealer.AttendanceDays.map((day) => {
        const zonedDate = toZonedTime(day.Date, conTimeZone)
        return format(zonedDate, 'EEEE')
      }).join(', '),
    [dealer]
  )

  const toggleFavorite = useToggleFavorite()

  // Check if not-attending warning should be marked.
  const markNotAttending = useMemo(() => {
    // Sun:0, Mon:1 , Tue:2, Wed:3, Thu:4, Fri:5, Sat:6.
    if (now.getDay() === 4 && !dealer.AttendsOnThursday) return true
    else if (now.getDay() === 5 && !dealer.AttendsOnFriday) return true
    else if (now.getDay() === 6 && !dealer.AttendsOnSaturday) return true
    return false
  }, [now, dealer])

  return (
    <>
      {!updated ? null : (
        <Badge unpad={parentPad} badgeColor='warning' textColor='white'>
          {t('dealer_was_updated')}
        </Badge>
      )}

      {!markNotAttending ? null : (
        <Badge unpad={parentPad} badgeColor='warning' textColor='invText'>
          {t('not_attending')}
        </Badge>
      )}

      {!dealer.Artist ? null : (
        <View style={[appStyles.shadow, avatarBackground, styles.avatarCircle]}>
          <Image
            contentFit='cover'
            style={styles.avatarImage}
            source={sourceFromImage(dealer.ArtistThumbnail)}
            accessibilityLabel={t('accessibility.dealer_avatar', {
              name: dealer.DisplayNameOrAttendeeNickname,
            })}
            accessibilityRole='image'
          />
        </View>
      )}

      {dealer.DisplayNameOrAttendeeNickname ? (
        <Label
          type='h1'
          variant='middle'
          className='mb-3'
          accessibilityRole='header'
          accessibilityLabel={t('accessibility.dealer_name_heading', {
            name: dealer.DisplayNameOrAttendeeNickname,
          })}
        >
          {dealer.DisplayNameOrAttendeeNickname}
        </Label>
      ) : null}

      <Label
        style={styles.marginAround}
        type='para'
        accessibilityLabel={t('accessibility.dealer_description', {
          description: dealer.ShortDescriptionContent,
        })}
      >
        {dealer.ShortDescriptionContent}
      </Label>

      <Row
        style={styles.marginAround}
        gap={5}
        accessibilityLabel={t('accessibility.dealer_attendance', { days })}
      >
        <Label type='caption'>{t('attends')}</Label>
        <Label type='caption' color='important'>
          {days}
        </Label>
      </Row>

      <Button
        style={styles.marginAround}
        outline={dealer.Favorite}
        icon={dealer.Favorite ? 'heart-minus' : 'heart-plus-outline'}
        onPress={() => toggleFavorite(dealer)}
        accessibilityLabel={
          dealer.Favorite
            ? t('accessibility.remove_favorite_button')
            : t('accessibility.add_favorite_button')
        }
        accessibilityHint={
          dealer.Favorite
            ? t('accessibility.remove_favorite_hint')
            : t('accessibility.add_favorite_hint')
        }
      >
        {dealer.Favorite ? t('remove_favorite') : t('add_favorite')}
      </Button>

      {!shareButton ? null : (
        <Button
          style={styles.marginAround}
          icon='share'
          onPress={() => shareDealer(dealer)}
          accessibilityLabel={t('accessibility.share_dealer_button')}
          accessibilityHint={t('accessibility.share_dealer_hint')}
        >
          {t('share')}
        </Button>
      )}

      {dealer.ShortDescriptionTable ? (
        <Row style={styles.marginAround} gap={5}>
          <Label type='h3' variant='receded'>
            {t('table')}
          </Label>
          {dealer.ShortDescriptionTable ? (
            <Label type='h3' color='important'>
              {dealer.ShortDescriptionTable}
            </Label>
          ) : null}
          {dealer.IsAfterDark ? (
            <Label type='h3' variant='receded'>
              ({t('in_after_dark')})
            </Label>
          ) : null}
        </Row>
      ) : null}

      {!dealer.MapLink ? null : (
        <LinkPreview
          url={dealer.MapLink}
          onPress={() => openBrowserAsync(dealer.MapLink ?? '')}
          style={styles.fullWidth}
        />
      )}

      <DealerCategories dealer={dealer} />

      {dealer.Links?.map((it) => (
        <View style={styles.marginAround} key={it.Name}>
          <LinkItem link={it} />
        </View>
      ))}

      {dealer.TelegramHandle && (
        <Button
          containerStyle={styles.marginAround}
          onPress={() =>
            handleExternalLink(`https://t.me/${dealer.TelegramHandle}`, {
              title: a11y('external_link_no_prompt'),
              body: a11y('outside_link'),
              confirmText: a11y('confirm'),
              cancelText: a11y('cancel'),
            })
          }
          icon={(props) => <FaIcon name='telegram-plane' {...props} />}
          accessibilityLabel={t('accessibility.telegram_button', {
            handle: dealer.TelegramHandle,
          })}
          accessibilityHint={t('accessibility.telegram_button_hint')}
        >
          Telegram: {dealer.TelegramHandle}
        </Button>
      )}
      {dealer.TwitterHandle && (
        <Button
          containerStyle={styles.marginAround}
          onPress={() =>
            handleExternalLink(`https://twitter.com/${dealer.TwitterHandle}`, {
              title: a11y('external_link_no_prompt'),
              body: a11y('outside_link'),
              confirmText: a11y('confirm'),
              cancelText: a11y('cancel'),
            })
          }
          icon='twitter'
          accessibilityLabel={t('accessibility.twitter_button', {
            handle: dealer.TwitterHandle,
          })}
          accessibilityHint={t('accessibility.twitter_button_hint')}
        >
          Twitter: {dealer.TwitterHandle}
        </Button>
      )}
      {dealer.DiscordHandle && (
        <Button
          containerStyle={styles.marginAround}
          onPress={async () => {
            if (!dealer.DiscordHandle) return null
            await setStringAsync(dealer.DiscordHandle)
            toast(
              'info',
              t('discord_handle_copied', {
                discordHandle: dealer.DiscordHandle,
              }),
              5000
            )
          }}
          icon='discord'
          accessibilityLabel={t('accessibility.discord_button', {
            handle: dealer.DiscordHandle,
          })}
          accessibilityHint={t('accessibility.discord_button_hint')}
        >
          Discord: {dealer.DiscordHandle}
        </Button>
      )}
      {dealer.MastodonHandle && (
        <Button
          containerStyle={styles.marginAround}
          onPress={() =>
            dealer.MastodonUrl
              ? handleExternalLink(dealer.MastodonUrl, {
                  title: a11y('external_link_no_prompt'),
                  body: a11y('outside_link'),
                  confirmText: a11y('confirm'),
                  cancelText: a11y('cancel'),
                })
              : null
          }
          icon='mastodon'
          accessibilityLabel={t('accessibility.mastodon_button', {
            handle: dealer.MastodonHandle,
          })}
          accessibilityHint={t('accessibility.mastodon_button_hint')}
        >
          Mastodon: {dealer.MastodonHandle}
        </Button>
      )}
      {dealer.BlueskyHandle && (
        <Button
          containerStyle={styles.marginAround}
          onPress={() =>
            handleExternalLink(
              `https://bsky.app/profile/${dealer.BlueskyHandle}`,
              {
                title: a11y('external_link_no_prompt'),
                body: a11y('outside_link'),
                confirmText: a11y('confirm'),
                cancelText: a11y('cancel'),
              }
            )
          }
          icon='cloud'
          accessibilityLabel={t('accessibility.bluesky_button', {
            handle: dealer.BlueskyHandle,
          })}
          accessibilityHint={t('accessibility.bluesky_button_hint')}
        >
          Bluesky: {dealer.BlueskyHandle}
        </Button>
      )}

      {!dealer.AboutTheArtText && !dealer.ArtPreview ? null : (
        <>
          <Section icon='film' title={t('about_the_art')} />

          {!dealer.ArtPreview ? null : (
            <View style={styles.posterLine}>
              <Banner image={dealer.ArtPreview} viewable />

              <Label
                className='mt-3'
                type='caption'
                numberOfLines={4}
                ellipsizeMode='tail'
                accessibilityLabel={t('accessibility.art_preview_caption', {
                  caption: dealer.ArtPreviewCaption,
                })}
              >
                {dealer.ArtPreviewCaption}
              </Label>
            </View>
          )}

          <Label
            type='para'
            accessibilityLabel={t('accessibility.about_art_text', {
              text: dealer.AboutTheArtText,
            })}
          >
            {dealer.AboutTheArtText}
          </Label>
        </>
      )}

      {!dealer.AboutTheArtistText && !dealer.ArtistImageId ? null : (
        <>
          <Section
            icon='account-circle-outline'
            title={t('about_the_artist', {
              name: dealer.DisplayNameOrAttendeeNickname,
            })}
          />

          {!dealer.Artist ? null : (
            <View style={styles.posterLine}>
              <Banner image={dealer.Artist} viewable />
            </View>
          )}

          <Label
            type='para'
            accessibilityLabel={t('accessibility.about_artist_text', {
              text: dealer.AboutTheArtistText,
            })}
          >
            {dealer.AboutTheArtistText}
          </Label>
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    alignSelf: 'center',
    margin: 20,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  aboutLine: {
    marginBottom: 20,
  },
  fullWidth: {
    width: '100%',
  },
  posterLine: {
    marginBottom: 20,
    alignItems: 'center',
  },
  marginBefore: {
    marginTop: 10,
  },
  marginAround: {
    marginTop: 10,
    marginBottom: 10,
  },
})
