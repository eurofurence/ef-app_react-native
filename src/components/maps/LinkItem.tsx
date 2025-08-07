import React, { FC, useCallback, useMemo } from 'react'
import { Linking, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { format, setDay } from 'date-fns'
import { router } from 'expo-router'
import { DealerCard } from '../dealers/DealerCard'
import { isPresent, joinOffDays } from '../dealers/utils'
import { FaIcon } from '../generic/atoms/FaIcon'
import { Icon } from '../generic/atoms/Icon'
import { Image } from '../generic/atoms/Image'
import { Button, ButtonProps } from '../generic/containers/Button'
import { LinkFragment } from '@/context/data/types.api'
import { useCache } from '@/context/data/Cache'
import { MapDetails, MapEntryDetails } from '@/context/data/types.details'

type LinkItemProps = {
  map?: MapDetails
  entry?: MapEntryDetails
  link: LinkFragment
}

const DealerLinkItem: FC<LinkItemProps> = ({ link }) => {
  const now = new Date()
  const day1 = format(setDay(now, 1), 'EEEE')
  const day2 = format(setDay(now, 2), 'EEEE')
  const day3 = format(setDay(now, 3), 'EEEE')

  const { dealers } = useCache()
  const dealer = dealers.dict[link.Target]
  const present = dealer ? isPresent(dealer, now) : false
  const offDays = dealer ? joinOffDays(dealer, day1, day2, day3) : ''

  const onPress = useCallback(() => router.push(`/dealer/${link.Target}`), [link.Target])

  if (!dealer) {
    return null
  }

  return <DealerCard dealer={{ details: dealer, present, offDays }} onPress={onPress} />
}

const hostName = (str: string) => {
  const lower = str.toLowerCase()
  const noScheme = lower.startsWith('https://') ? lower.substring(8) : lower.startsWith('http://') ? lower.substring(7) : lower
  const pathIndex = noScheme.indexOf('/')
  const noPath = pathIndex > 0 ? noScheme.substring(0, pathIndex) : noScheme
  const segments = noPath.split('.')
  return segments[segments.length - 2] + '.' + segments[segments.length - 1]
}

const sanitized = (str: string) => {
  const lower = str.toLowerCase()
  const noScheme = lower.startsWith('https://') ? lower.substring(8) : lower.startsWith('http://') ? lower.substring(7) : lower
  const noWww = noScheme.startsWith('www.') ? noScheme.substring(4) : noScheme
  return noWww.endsWith('/') ? noWww.substring(0, noWww.length - 2) : noWww
}

const WebExternalLinkItem: FC<LinkItemProps> = ({ link }) => {
  const { t } = useTranslation('Maps')
  const onPress = useCallback(() => {
    Linking.openURL(link.Target).catch()
  }, [link.Target])

  const icon = useMemo<ButtonProps['icon']>(() => {
    const host = hostName(link.Target)
    let icon: ButtonProps['icon']

    if (host === 'etsy.com') {
      icon = (props) => <FaIcon name="etsy" {...props} />
    } else if (host === 'tumblr.com') {
      icon = (props) => <FaIcon name="tumblr" {...props} />
    } else if (host === 'trello.com') {
      icon = (props) => <FaIcon name="trello" {...props} />
    } else if (host === 'furaffinity.net') {
      icon = ({ size }) => <Image style={{ width: size, height: size }} source="https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png?v2" />
    } else if (host === 'twitter.com') {
      icon = (props) => <Icon name="twitter" {...props} />
    } else {
      icon = 'web'
    }
    return icon
  }, [link.Target])

  const displayText = link.Name || sanitized(link.Target)
  const host = hostName(link.Target)

  return (
    <Button
      containerStyle={styles.linkButton}
      onPress={onPress}
      icon={icon}
      accessibilityLabel={t('accessibility.web_external_link', { name: displayText, host })}
      accessibilityHint={t('accessibility.web_external_link_hint')}
      accessibilityRole="link"
    >
      {displayText}
    </Button>
  )
}

const MapEntryLinkItem: FC<LinkItemProps> = ({ map, entry, link }) => {
  const { t } = useTranslation('Maps')
  const onPress = useCallback(() => {
    if (map && entry) {
      router.push(`/map/${map.Id}?entryId=${entry.Id}&linkId=${entry.Links.indexOf(link)}`)
    }
  }, [map, entry, link])

  return !map || !entry ? null : (
    <Button
      containerStyle={styles.linkButton}
      onPress={onPress}
      accessibilityLabel={t('accessibility.map_entry_link', { name: link.Name })}
      accessibilityHint={t('accessibility.map_entry_link_hint')}
    >
      {link.Name}
    </Button>
  )
}

const EventConferenceRoomLinkItem: FC<LinkItemProps> = ({ map, entry, link }) => {
  const { t } = useTranslation('Maps')
  const onPress = useCallback(() => {
    if (map && entry) {
      router.push(`/map/${map.Id}?entryId=${entry.Id}&linkId=${entry.Links.indexOf(link)}`)
    }
  }, [map, entry, link])

  return !map || !entry ? null : (
    <Button
      containerStyle={styles.linkButton}
      onPress={onPress}
      accessibilityLabel={t('accessibility.event_conference_room_link', { name: link.Name })}
      accessibilityHint={t('accessibility.event_conference_room_link_hint')}
    >
      {link.Name}
    </Button>
  )
}

export const LinkItem: FC<LinkItemProps> = ({ map, entry, link }) => {
  return match(link.FragmentType)
    .with('DealerDetail', () => <DealerLinkItem map={map} entry={entry} link={link} />)
    .with('WebExternal', () => <WebExternalLinkItem map={map} entry={entry} link={link} />)
    .with('MapEntry', () => <MapEntryLinkItem map={map} entry={entry} link={link} />)
    .with('EventConferenceRoom', () => <EventConferenceRoomLinkItem map={map} entry={entry} link={link} />)
    .otherwise(() => null)
}

const styles = StyleSheet.create({
  linkButton: {
    marginVertical: 5,
  },
})
