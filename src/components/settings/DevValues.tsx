import {announcementsCollection} from "@/data/collections/content/Announcements";
import {artistsAlleyCollection} from "@/data/collections/artists-alley/ArtistsAlley";
import {daysCollection} from "@/data/collections/content/Days";
import {dealersCollection} from "@/data/collections/content/Dealers";
import {eventsCollection} from "@/data/collections/content/Events";
import {imagesCollection} from "@/data/collections/content/Images";
import {kbEntriesCollection} from "@/data/collections/content/KbEntries";
import {kbGroupsCollection} from "@/data/collections/content/KbGroups";
import {localNotificationsCollection} from "@/data/collections/supplemental/LocalNotifications";
import {lostAndFoundCollection} from "@/data/collections/content/LostAndFound";
import {mapsCollection} from "@/data/collections/content/Maps";
import {roomsCollection} from "@/data/collections/content/Rooms";
import {tracksCollection} from "@/data/collections/content/Tracks";
import {useLiveQuery} from "@tanstack/react-db";
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Label } from '@/components/generic/atoms/Label'
import { Section } from '@/components/generic/atoms/Section'
import { useAuthState } from '@/data/clients/auth'
import { getDevicePushToken } from '@/hooks/tokens/useTokenManager'

export function DevValues() {
  const { t } = useTranslation('Settings', { keyPrefix: 'dev_values' })
  const { tokenResponse, claims, user } = useAuthState()

  const [devicePushToken, setDevicePushToken] = useState<any | null>(null)

  const insets = useSafeAreaInsets()

  useEffect(() => {
    getDevicePushToken().then((value) => setDevicePushToken(value))
  }, [])

  const {data: notifications} = useLiveQuery(localNotificationsCollection)
  const {data: announcements} = useLiveQuery(announcementsCollection)
  const {data: artistsAlley} = useLiveQuery(artistsAlleyCollection)
  const {data: days} = useLiveQuery(daysCollection)
  const {data: dealers} = useLiveQuery(dealersCollection)
  const {data: events} = useLiveQuery(eventsCollection)
  const {data: images} = useLiveQuery(imagesCollection)
  const {data: kbEntries} = useLiveQuery(kbEntriesCollection)
  const {data: kbGroups} = useLiveQuery(kbGroupsCollection)
  const {data: lostAndFound} = useLiveQuery(lostAndFoundCollection)
  const {data: maps} = useLiveQuery(mapsCollection)
  const {data: rooms} = useLiveQuery(roomsCollection)
  const {data: tracks} = useLiveQuery(tracksCollection)
  const collections = {
    announcements,
    artistsAlley,
    days,
    dealers,
    events,
    images,
    kbEntries,
    kbGroups,
    lostAndFound,
    maps,
    rooms,
    tracks,
  }

  return (
    <View className='p-4'>
      <Section title={t('title')} subtitle={t('subtitle')} />

      <Label className='mt-5' type='h3'>
        {t('claims')}
      </Label>
      <Label className='ml-2'>
        {claims ? JSON.stringify(claims, null, 2) : 'None'}
      </Label>
      <Label className='mt-5' type='h3'>
        {t('user')}
      </Label>
      <Label className='ml-2'>
        {user ? JSON.stringify(user, null, 2) : 'None'}
      </Label>

      <Label className='mt-5' type='h3'>
        {t('notifications')}
      </Label>
      <View>
        {notifications?.map((item) => {
          return (
            <View key={item.TargetId} className='py-1 ml-2'>
              <Label type='regular'>
                Event notification {item.ScheduledUtc}
              </Label>
            </View>
          )
        })}
        {!notifications?.length && (
          <Label type='regular' className='ml-2'>
            {t('noScheduledNotifications')}
          </Label>
        )}
      </View>
      <Label className='mt-5' type='h3'>
        {t('token_data')}
      </Label>
      <Label className='ml-2'>
        {tokenResponse ? JSON.stringify(tokenResponse, null, 2) : 'None'}
      </Label>

      <Label className='mt-5' type='h3'>
        {t('device_push_token')}
      </Label>
      <Label className='ml-2'>
        {devicePushToken ? JSON.stringify(devicePushToken, null, 2) : 'None'}
      </Label>

      <Label className='mt-5' type='h3'>
        {t('safe_area_insets')}
      </Label>
      <Label className='ml-2'>{JSON.stringify(insets, null, 2)}</Label>

      <Label className='mt-5' type='h3'>
        {t('cache_values')}
      </Label>
      {Object.entries(collections).map(([key, value]) => (
        <Fragment key={key}>
          <Label className='mt-3' type='h4'>
            {key}
          </Label>
          <Label className='ml-2'>{value.length} items</Label>
          <Label className='ml-2'>{JSON.stringify(value.slice(0, 4), null, 2)}</Label>
        </Fragment>
      ))}
    </View>
  )
}
