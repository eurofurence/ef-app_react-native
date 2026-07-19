import {onPressDealer} from "@/app/(areas)/dealers/all";
import {DealerCard2} from "@/components/dealers/DealerCard2";
import {dealersFullCollection} from "@/data/collections/content/DealersFull";
import type {EfMapFull} from "@/data/collections/content/MapsFull";
import type {EfLink} from "@/data/types/EfLink";
import type {EfMapEntry} from "@/data/types/EfMapEntry";
import {eq, useLiveQuery} from "@tanstack/react-db";
import { router } from 'expo-router'
import type { FC } from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet } from 'react-native'

import { confirmPrompt } from '@/util/confirmPrompt'

import { FaIcon } from '../generic/atoms/FaIcon'
import { Icon } from '../generic/atoms/Icon'
import { Image } from '../generic/atoms/Image'
import { Button, type ButtonProps } from '../generic/containers/Button'

type LinkItemProps = {
  map?: EfMapFull
  entry?: EfMapEntry
  link: EfLink
}

const DealerLinkItem: FC<LinkItemProps> = ({ link }) => {
  const {data: dealer} = useLiveQuery({
    id: `dealer-link-item-${link.Id}`,
    query: q => q
      .from({dealer: dealersFullCollection})
      .where(({dealer}) => eq(dealer.Id, link.Target))
      .findOne()
  }, [link.Target])


  if (!dealer) {
    return null
  }

  return (
    <DealerCard2
      dealer={dealer}
      onPress={onPressDealer}
    />
  )
}

const WebExternalLinkItem: FC<LinkItemProps> = ({ link }) => {
  const { t } = useTranslation('Maps')
  const { t: a11y } = useTranslation('Accessibility')

  const onPress = useCallback(async () => {
    // If the external link points to our lost-and-found page, navigate in-app instead
    try {
      const lower = link.Target.toLowerCase()
      if (
        lower.includes('lost-and-found') ||
        lower.includes('lost%20and%20found') ||
        lower.includes('/lostandfound')
      ) {
        router.push('/lost-and-found')
        return
      }
    } catch {
      // ignore and fall back to opening externally
    }

    if (Platform.OS !== 'web') {
      // Prompt user with a warning before leaving the app
      const prompt = await confirmPrompt({
        title: a11y('external_link_no_prompt'),
        body: a11y('outside_link'),
        confirmText: a11y('confirm'),
        cancelText: a11y('cancel'),
      })
      if (prompt === true) {
        Linking.openURL(link.Target).catch()
      }
    } else {
      Linking.openURL(link.Target).catch()
    }
  }, [a11y, link.Target])

  const linkUrl = new URL(link.Target)
  const displayText = link.Name || linkUrl.hostname.replace(/^www\./, '')
  const hostTLD = linkUrl.hostname.match(/([^.]+\.[^.]+)$/)?.[0]

  const icon = useMemo<ButtonProps['icon']>(() => {
    let icon: ButtonProps['icon']

    if (hostTLD === 'etsy.com') {
      icon = (props) => <FaIcon name='etsy' {...props} />
    } else if (hostTLD === 'tumblr.com') {
      icon = (props) => <FaIcon name='tumblr' {...props} />
    } else if (hostTLD === 'trello.com') {
      icon = (props) => <FaIcon name='trello' {...props} />
    } else if (hostTLD === 'furaffinity.net') {
      icon = ({ size }) => (
        <Image
          style={{ width: size, height: size }}
          source='https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png?v2'
        />
      )
    } else if (hostTLD === 'twitter.com') {
      icon = (props) => <Icon name='twitter' {...props} />
    } else {
      icon = 'web'
    }
    return icon
  }, [hostTLD])

  return (
    <Button
      containerStyle={styles.linkButton}
      onPress={onPress}
      icon={icon}
      accessibilityLabel={t('accessibility.web_external_link', {
        name: displayText,
        host: hostTLD,
      })}
      accessibilityHint={t('accessibility.web_external_link_hint')}
      accessibilityRole='link'
    >
      {displayText}
    </Button>
  )
}

const MapEntryLinkItem: FC<LinkItemProps> = ({ map, entry, link }) => {
  const { t } = useTranslation('Maps')
  const onPress = useCallback(() => {
    if (map && entry) {
      router.push(`/maps/${map.Id}/${entry.Id}/${entry.Links.indexOf(link)}`)
    }
  }, [map, entry, link])

  return !map || !entry ? null : (
    <Button
      containerStyle={styles.linkButton}
      onPress={onPress}
      accessibilityLabel={t('accessibility.map_entry_link', {
        name: link.Name,
      })}
      accessibilityHint={t('accessibility.map_entry_link_hint')}
    >
      {link.Name}
    </Button>
  )
}

const EventConferenceRoomLinkItem: FC<LinkItemProps> = ({
  map,
  entry,
  link,
}) => {
  const { t } = useTranslation('Maps')
  const onPress = useCallback(() => {
    if (map && entry) {
      router.push(`/maps/${map.Id}/${entry.Id}/${entry.Links.indexOf(link)}`)
    }
  }, [map, entry, link])

  return !map || !entry ? null : (
    <Button
      containerStyle={styles.linkButton}
      onPress={onPress}
      accessibilityLabel={t('accessibility.event_conference_room_link', {
        name: link.Name,
      })}
      accessibilityHint={t('accessibility.event_conference_room_link_hint')}
    >
      {link.Name}
    </Button>
  )
}

export const LinkItem: FC<LinkItemProps> = ({ map, entry, link }) => {
  switch (link.FragmentType) {
    case 'WebExternal':
      return <WebExternalLinkItem map={map} entry={entry} link={link} />
    case 'MapEntry':
      return <MapEntryLinkItem map={map} entry={entry} link={link} />
    case 'DealerDetail':
      return <DealerLinkItem map={map} entry={entry} link={link} />
    case 'EventConferenceRoom':
      return <EventConferenceRoomLinkItem map={map} entry={entry} link={link} />
    default:
      return null
  }
}

const styles = StyleSheet.create({
  linkButton: {
    marginVertical: 5,
  },
})
