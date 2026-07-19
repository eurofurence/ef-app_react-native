import { differenceInMilliseconds } from 'date-fns'
import { de } from 'date-fns/locale/de'
import { format } from 'date-fns-tz'
import { useCalendars } from 'expo-localization'
import { router } from 'expo-router'
import { openBrowserAsync } from 'expo-web-browser'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { shareEvent } from '@/components/events/Events.common'
import { conTimeZone } from '@/configuration'
import type { EfEventFull } from '@/data/collections/content/EventsFull'
import { favoriteEventsToggle } from '@/data/collections/supplemental/FavoriteEvents'
import type { EfId } from '@/data/types/EfId'
import { deriveIconFromTags } from '@/data/utils/deriveIconFromTags'
import { deriveIsMaskRequired } from '@/data/utils/deriveIsMaskRequired'
import { deriveIsSponsorsOnly } from '@/data/utils/deriveIsSponsorsOnly'
import { deriveIsSuperSponsorsOnly } from '@/data/utils/deriveIsSuperSponsorsOnly'
import {
  useViewTrackingState,
  useViewTrackingUpdate,
} from '@/hooks/data/useUpdateSinceNote'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { useNow } from '@/hooks/time/useNow'
import { getTiming } from '@/util/eventTiming'
import { Banner } from '../generic/atoms/Banner'
import { Icon, type IconNames, platformShareIcon } from '../generic/atoms/Icon'
import { Label } from '../generic/atoms/Label'
import { MarkdownContent } from '../generic/atoms/MarkdownContent'
import { Progress } from '../generic/atoms/Progress'
import { Section } from '../generic/atoms/Section'
import { Badge } from '../generic/containers/Badge'
import { Button } from '../generic/containers/Button'
import { Row } from '../generic/containers/Row'
import { LinkPreview } from '../maps/LinkPreview'

/**
 * Props to the content.
 */
export type EventContent2Props = {
  /**
   * The event to display.
   */
  event: EfEventFull

  /**
   * The padding used by the parent horizontally.
   */
  parentPad?: number

  /**
   * True if a dedicated share button should be displayed.
   */
  shareButton?: boolean

  /**
   * Callback when the event's hidden state is toggled.
   */
  onToggleHidden?: (id: EfId) => void
}

/**
 * Placeholder blur hash.
 */
const placeholder = { blurhash: 'L38D%z^%020303D+bv~m%IWF-nIr/1309/667' }

export function EventContent2({
  event,
  parentPad = 0,
  shareButton,
  onToggleHidden,
}: EventContent2Props) {
  const { t } = useTranslation('Event')
  const isFavorite = Boolean(event.Favorite)
  const now = useNow()

  const colorGlyph = useThemeColorValue('darken')

  useViewTrackingUpdate(event)
  const updated = useViewTrackingState(event)

  const progress =
    differenceInMilliseconds(now, new Date(event.StartDateTimeUtc)) /
    differenceInMilliseconds(
      new Date(event.EndDateTimeUtc),
      new Date(event.StartDateTimeUtc)
    )

  const SuperSponsorOnly = deriveIsSuperSponsorsOnly(event.Tags)
  const SponsorOnly = deriveIsSponsorsOnly(event.Tags)
  const Glyph = deriveIconFromTags(event.Tags)
  const MaskRequired = deriveIsMaskRequired(event.Tags)

  const happening = progress >= 0.0 && progress <= 1.0
  const feedbackDisabled = progress < 0.0

  const calendar = useCalendars()
  const { zone, start, end, day, startLocal, endLocal, dayLocal, date } =
    useMemo(() => {
      const timing = getTiming(event)
      const timeZone = calendar[0]?.timeZone ?? conTimeZone
      const zone = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'short',
      })
        .format(new Date())
        .split(' ')
        .pop()
      const start = format(timing.start, 'p', { timeZone, locale: de })
      const end = format(timing.end, 'p', { timeZone, locale: de })
      const day = format(timing.start, 'EEE', { timeZone })
      const date = format(timing.start, 'yyyy-MM-dd', { timeZone })
      const startLocal = format(timing.startLocal, 'p', { locale: de })
      const endLocal = format(timing.endLocal, 'p', { locale: de })
      const dayLocal = format(timing.startLocal, 'EEE')
      return { zone, start, end, day, startLocal, endLocal, dayLocal, date }
    }, [calendar, event])

  const mapLink = event.Room?.MapLink

  return (
    <>
      {!updated ? null : (
        <Badge unpad={parentPad} badgeColor='warning' textColor='white'>
          {t('event_was_updated')}
        </Badge>
      )}

      {!SuperSponsorOnly ? null : (
        <Badge
          unpad={parentPad}
          badgeColor='superSponsor'
          textColor='superSponsorText'
        >
          {t('supersponsor_event')}
        </Badge>
      )}

      {!SponsorOnly ? null : (
        <Badge unpad={parentPad} badgeColor='sponsor' textColor='sponsorText'>
          {t('sponsor_event')}
        </Badge>
      )}

      {!event.IsInternal ? null : (
        <Badge unpad={parentPad} badgeColor='staff' textColor='staffText'>
          {t('internal_event')}
        </Badge>
      )}

      {!event.Poster ? null : (
        <View style={styles.posterLine}>
          <Banner image={event.Poster} placeholder={placeholder} viewable />
        </View>
      )}
      {isFavorite || Glyph ? (
        <View style={styles.glyphArranger}>
          <View style={styles.glyphContainer}>
            {(() => {
              const iconName: IconNames =
                (isFavorite ? 'heart' : (Glyph as IconNames)) ?? 'blank'
              return (
                <Icon
                  style={styles.glyph}
                  color={colorGlyph}
                  name={iconName}
                  size={200}
                />
              )
            })()}
          </View>
        </View>
      ) : null}

      {event.Title ? (
        <Label type='h1' className='mt-5'>
          {event.Title}
        </Label>
      ) : null}
      {event.SubTitle ? <Label type='compact'>{event.SubTitle}</Label> : null}
      {event.Track?.Name ? (
        <Row style={styles.marginAround} gap={5}>
          <Label type='caption'>{t('label_event_track')}</Label>
          <Label type='caption' color='important'>
            {event.Track?.Name}
          </Label>
        </Row>
      ) : null}

      {!happening ? null : (
        <Progress style={styles.marginBefore} value={progress} />
      )}

      <Label style={styles.marginAround} type='h3'>
        {t('when', {
          day: day,
          date: date,
          start: start,
          finish: end,
          zone: zone,
        })}
        {start === startLocal ? null : (
          <Label type='h3' variant='receded'>
            {' ' +
              t('when_local', {
                day: dayLocal,
                date: date,
                start: startLocal,
                finish: endLocal,
                zone: zone,
              })}
          </Label>
        )}
      </Label>

      <MarkdownContent style={styles.marginAround} defaultType='para'>
        {event.Abstract}
      </MarkdownContent>

      {event.PanelHosts ? (
        <Row style={styles.marginAround} gap={5}>
          <Label type='caption'>{t('label_event_panelhosts')}</Label>
          <Label type='caption' color='important'>
            {event.PanelHosts}
          </Label>
        </Row>
      ) : null}

      {!MaskRequired ? null : (
        <Badge
          unpad={parentPad}
          icon='face-mask'
          textColor='secondary'
          textType='regular'
          textVariant='regular'
        >
          {t('mask_required')}
        </Badge>
      )}

      {!shareButton ? null : (
        <Button icon={platformShareIcon} onPress={() => shareEvent(event)}>
          {t('share')}
        </Button>
      )}

      <Row type='stretch' style={styles.marginAround} gap={16}>
        <Button
          containerStyle={styles.flex}
          outline={isFavorite}
          icon={isFavorite ? 'heart-minus' : 'heart-plus-outline'}
          onPress={() => favoriteEventsToggle(event.Id)}
        >
          {isFavorite ? t('remove_favorite') : t('add_favorite')}
        </Button>
        <Button
          containerStyle={styles.flex}
          icon={event.Hidden ? 'eye' : 'eye-off'}
          onPress={() => onToggleHidden?.(event.Id)}
          outline
        >
          {event.Hidden ? t('reveal') : t('hide')}
        </Button>
      </Row>

      {event.IsAcceptingFeedback && (
        <Button
          disabled={feedbackDisabled}
          containerStyle={styles.marginAround}
          icon='pencil'
          onPress={() =>
            router.navigate({
              pathname: '/events/[id]/feedback',
              params: { id: event.Id },
            })
          }
        >
          {t('give_feedback')}
        </Button>
      )}

      {event.Room?.Name ? (
        <Row style={styles.marginAround} gap={5}>
          <Label type='h3' variant='receded'>
            {t('label_event_room')}
          </Label>
          <Label type='h3' color='important'>
            {event.Room.Name}
          </Label>
        </Row>
      ) : null}

      {!mapLink ? null : (
        <LinkPreview
          url={mapLink}
          onPress={() => openBrowserAsync(mapLink)}
          style={styles.fullWidth}
        />
      )}

      <Section icon='information' title={t('label_event_description')} />
      <MarkdownContent defaultType='para'>{event.Description}</MarkdownContent>
    </>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  marginBefore: {
    marginTop: 10,
  },
  marginAround: {
    marginTop: 10,
    marginBottom: 10,
  },
  posterLine: {
    marginTop: 20,
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  glyphArranger: {
    width: '100%',
    height: 0,
  },
  glyphContainer: {
    position: 'absolute',
    top: -20,
    right: -50,
  },
  glyph: {
    opacity: 0.2,
    transform: [{ rotate: '15deg' }],
  },
})
