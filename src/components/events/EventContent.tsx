import { useIsFocused } from '@react-navigation/core'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useCalendars } from 'expo-localization'
import { captureException } from '@sentry/react-native'
import { router } from 'expo-router'
import { differenceInMilliseconds } from 'date-fns'
import { toZonedTime, format } from 'date-fns-tz'
import { Banner } from '../generic/atoms/Banner'
import { Label } from '../generic/atoms/Label'
import { MarkdownContent } from '../generic/atoms/MarkdownContent'
import { Progress } from '../generic/atoms/Progress'
import { Section } from '../generic/atoms/Section'
import { Badge } from '../generic/containers/Badge'
import { Button } from '../generic/containers/Button'
import { ImageExButton } from '../generic/containers/ImageButton'
import { Row } from '../generic/containers/Row'
import { Icon, platformShareIcon } from '../generic/atoms/Icon'
import { conTimeZone } from '@/configuration'
import { shareEvent } from '@/components/events/Events.common'
import { useNow } from '@/hooks/time/useNow'
import { useEventReminder } from '@/hooks/data/useEventReminder'
import { getValidLinksByTarget } from '@/store/eurofurence/selectors/maps'
import { EventDetails, LinkFragment, MapDetails, MapEntryDetails } from '@/context/data/types'
import { useCache } from '@/context/data/Cache'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'

interface MapLink {
    map: MapDetails;
    entry: MapEntryDetails;
    link: LinkFragment;
}

/**
 * Props to the content.
 */
export type EventContentProps = {
    /**
     * The event to display.
     */
    event: EventDetails;

    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;

    /**
     * True if the event was updated.
     */
    updated?: boolean;

    /**
     * True if a dedicated share button should be displayed.
     */
    shareButton?: boolean;

    /**
     * Callback when the event's hidden state is toggled.
     */
    onToggleHidden?: (event: EventDetails) => void;
};

/**
 * Placeholder blur hash.
 */
const placeholder = 'L38D%z^%020303D+bv~m%IWF-nIr/1309/667'

export const EventContent: FC<EventContentProps> = ({ event, parentPad = 0, updated, shareButton, onToggleHidden }) => {
    const { t } = useTranslation('Event')
    const { isFavorite, toggleReminder } = useEventReminder(event)
    const isFocused = useIsFocused()
    const now = useNow(isFocused ? 5 : 'static')

    const colorGlyph = useThemeColorValue('darken')

    const progress = differenceInMilliseconds(now, new Date(event.StartDateTimeUtc)) / differenceInMilliseconds(new Date(event.EndDateTimeUtc), new Date(event.StartDateTimeUtc))
    const happening = progress >= 0.0 && progress <= 1.0
    const feedbackDisabled = progress < 0.0

    const track = event.ConferenceTrack
    const room = event.ConferenceRoom

    const { maps } = useCache()
    const mapLink = useMemo(() => getValidLinksByTarget(maps, room?.Id), [maps, room])

    const calendar = useCalendars()
    const { zone, start, end, day, startLocal, endLocal, dayLocal } = useMemo(() => {
        const timeZone = calendar[0]?.timeZone ?? conTimeZone
        const zone = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' }).format(new Date()).split(' ').pop()
        const eventStart = toZonedTime(new Date(event.StartDateTimeUtc), conTimeZone)
        const eventEnd = toZonedTime(new Date(event.EndDateTimeUtc), conTimeZone)
        const start = format(eventStart, 'p')
        const end = format(eventEnd, 'p')
        const day = format(eventStart, 'EEE')
        const startLocal = format(new Date(event.StartDateTimeUtc), 'p')
        const endLocal = format(new Date(event.EndDateTimeUtc), 'p')
        const dayLocal = format(new Date(event.StartDateTimeUtc), 'EEE')
        return { zone, start, end, day, startLocal, endLocal, dayLocal }
    }, [calendar, event.StartDateTimeUtc, event.EndDateTimeUtc])

    return (
        <>

            {!updated ? null : (
                <Badge unpad={parentPad} badgeColor="warning" textColor="white">
                    {t('event_was_updated')}
                </Badge>
            )}

            {!event.SuperSponsorOnly ? null : (
                <Badge unpad={parentPad} badgeColor="superSponsor" textColor="superSponsorText">
                    {t('supersponsor_event')}
                </Badge>
            )}

            {!event.SponsorOnly ? null : (
                <Badge unpad={parentPad} badgeColor="sponsor" textColor="sponsorText">
                    {t('sponsor_event')}
                </Badge>
            )}

            {!event.Poster ? null : (
                <View style={styles.posterLine}>
                    <Banner image={event.Poster} placeholder={placeholder} viewable />
                </View>
            )}
            {isFavorite || event.Glyph ?
                <View style={styles.glyphArranger}>
                    <View style={styles.glyphContainer}>
                        <Icon style={styles.glyph} color={colorGlyph} name={isFavorite ? 'heart' : event.Glyph} size={200} />
                    </View>
                </View> : null
            }

            {event.Title ? <Label type="h1" mt={20}>{event.Title}</Label> : null}
            {event.SubTitle ? <Label type="compact">{event.SubTitle}</Label> : null}
            {track?.Name ?
                <Row style={styles.marginAround} gap={5}>
                    <Label type="caption">{t('label_event_track')}</Label>
                    <Label type="caption" color="important">{event.ConferenceTrack?.Name}</Label>
                </Row>
                : null}

            {!happening ? null : <Progress style={styles.marginBefore} value={progress} />}

            <Label style={styles.marginAround} type="h3">
                {t('when', {
                    day: day,
                    start: start,
                    finish: end,
                })}
                {start === startLocal ? null : (
                    <Label type="bold">
                        {' ' +
                            t('when_local', {
                                day: dayLocal,
                                start: startLocal,
                                finish: endLocal,
                                zone: zone,
                            })}
                    </Label>
                )}
            </Label>

            <MarkdownContent style={styles.marginAround} defaultType="para">
                {event.Abstract}
            </MarkdownContent>

            {event.PanelHosts ?
                <Row style={styles.marginAround} gap={5}>
                    <Label type="caption">{t('label_event_panelhosts')}</Label>
                    <Label type="caption" color="important">{event.PanelHosts}</Label>
                </Row> : null}


            {!event.MaskRequired ? null : (
                <Badge unpad={parentPad} icon="face-mask" textColor="secondary" textType="regular" textVariant="regular">
                    {t('mask_required')}
                </Badge>
            )}

            {!shareButton ? null : (
                <Button icon={platformShareIcon} onPress={() => shareEvent(event)}>
                    {t('share')}
                </Button>
            )}

            <Row style={styles.marginAround} gap={16}>
                <Button
                    containerStyle={styles.flex}
                    outline={isFavorite}
                    icon={isFavorite ? 'heart-minus' : 'heart-plus-outline'}
                    onPress={() => toggleReminder().catch(captureException)}
                >
                    {isFavorite ? t('remove_favorite') : t('add_favorite')}
                </Button>
                <Button containerStyle={styles.flex} icon={event.Hidden ? 'eye' : 'eye-off'} onPress={() => onToggleHidden?.(event)} outline>
                    {event.Hidden ? t('reveal') : t('hide')}
                </Button>
            </Row>

            {event.IsAcceptingFeedback && (
                <Button
                    disabled={feedbackDisabled}
                    containerStyle={styles.marginAround}
                    icon="pencil"
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

            {room?.Name ? <Row style={styles.marginAround} gap={5}>
                <Label type="h3" variant="receded">{t('label_event_room')}</Label>
                <Label type="h3" color="important">{room.Name}</Label>
            </Row> : null}

            {!mapLink
                ? null
                : mapLink.map(({ map, entry, link }: MapLink, i: number) => (
                    <ImageExButton
                        key={i}
                        image={map.Image}
                        target={{ x: entry.X, y: entry.Y, size: entry.TapRadius * 10 }}
                        onPress={() =>
                            router.navigate({
                                pathname: '/maps/[mapId]/[entryId]/[linkId]',
                                params: { mapId: map.Id, entryId: entry.Id, linkId: entry.Links.indexOf(link) },
                            })
                        }
                    />
                ))}

            <Section icon="information" title={t('label_event_description')} />
            <MarkdownContent defaultType="para">{event.Description}</MarkdownContent>
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
        opacity: 0.20,
        transform: [{ rotate: '15deg' }],
    },
})
