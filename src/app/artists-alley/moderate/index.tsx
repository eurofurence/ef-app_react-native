import { Redirect, router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { artistsAlleySectionForState, ArtistsAlleySectionProps } from '@/components/artists-alley/ArtistsAlleySection'
import { ArtistsAlleySectionedList } from '@/components/artists-alley/ArtistsAlleySectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { Header } from '@/components/generic/containers/Header'
import { Button } from '@/components/generic/containers/Button'
import { useUserContext } from '@/context/auth/User'
import { TableRegistrationRecord } from '@/context/data/types.api'
import { ArtistAlleyDetails } from '@/context/data/types.details'
import { useArtistsAlleyQuery } from '@/hooks/api/artists-alley/useArtistsAlleyQuery'
import { artistAlleyUrl } from '@/configuration'

export default function List() {
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'list' })
  const { user } = useUserContext()

  // Get roles for preemptive RBAC.
  const isPrivileged = Boolean(user?.RoleMap?.Admin) || Boolean(user?.RoleMap?.ArtistAlleyAdmin) || Boolean(user?.RoleMap?.ArtistAlleyModerator)

  const { data: source, refetch, isFetching } = useArtistsAlleyQuery(isPrivileged)

  const items = useMemo((): (ArtistsAlleySectionProps | ArtistAlleyDetails | TableRegistrationRecord)[] => {
    if (!source) return []
    const pending = []
    const accepted = []
    const published = []
    const rejected = []
    for (const item of source) {
      if (!('State' in item)) continue

      if (item.State === 'Pending') pending.push(item)
      else if (item.State === 'Accepted') accepted.push(item)
      else if (item.State === 'Published') published.push(item)
      else if (item.State === 'Rejected') rejected.push(item)
    }

    const result = []
    if (pending.length) {
      result.push(artistsAlleySectionForState(t, 'Pending'))
      result.push(...pending)
    }
    if (accepted.length) {
      result.push(artistsAlleySectionForState(t, 'Accepted'))
      result.push(...accepted)
    }
    if (published.length) {
      result.push(artistsAlleySectionForState(t, 'Published'))
      result.push(...published)
    }
    if (rejected.length) {
      result.push(artistsAlleySectionForState(t, 'Rejected'))
      result.push(...rejected)
    }
    return result
  }, [source, t])

  const leader = useMemo(() => {
    return (
      <View className="m-5 gap-4">
        <Label type="h3" variant="middle">
          {t('moderate')}
        </Label>
        <Label type="compact" variant="middle">
          {t('moderate_intro')}
        </Label>
        <Button icon="link" onPress={() => Linking.openURL(artistAlleyUrl)}>
          {t('moderate_rules')}
        </Button>
      </View>
    )
  }, [t])

  const onPress = useCallback((item: ArtistAlleyDetails | TableRegistrationRecord) => {
    router.navigate({
      pathname: '/artists-alley/moderate/[id]',
      params: { id: item.Id },
    })
  }, [])

  if (!isPrivileged) return <Redirect href="/artists-alley" />

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header>{t('moderate_header')}</Header>
      <ArtistsAlleySectionedList leader={leader} items={items} onPress={onPress} onRefresh={refetch} refreshing={isFetching} />
    </View>
  )
}
