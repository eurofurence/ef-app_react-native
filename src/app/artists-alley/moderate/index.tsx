import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { Redirect, router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { useArtistsAlleyQuery } from '@/hooks/api/artists-alley/useArtistsAlleyQuery'
import { StyleSheet, View } from 'react-native'
import { Header } from '@/components/generic/containers/Header'
import { useTranslation } from 'react-i18next'
import { useAuthContext } from '@/context/auth/Auth'
import { artistsAlleySectionForState, ArtistsAlleySectionProps } from '@/components/artists-alley/ArtistsAlleySection'
import { ArtistsAlleySectionedList } from '@/components/artists-alley/ArtistsAlleySectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { useNow } from '@/hooks/time/useNow'
import { TableRegistrationRecord } from '@/context/data/types.api'
import { ArtistAlleyDetails } from '@/context/data/types.details'

export default function List() {
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'list' })
  const { loggedIn } = useAuthContext()
  const { data: user } = useUserSelfQuery()

  // Get roles for preemptive RBAC.
  const isPrivileged = Boolean(user?.RoleMap?.Admin) || Boolean(user?.RoleMap?.ArtistAlleyAdmin) || Boolean(user?.RoleMap?.ArtistAlleyModerator)

  const { data: source } = useArtistsAlleyQuery(isPrivileged)

  const now = useNow()

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
      <>
        <Label type="lead" variant="middle" className="mt-8">
          {t('moderate')}
        </Label>
      </>
    )
  }, [t])

  const onPress = useCallback((item: ArtistAlleyDetails | TableRegistrationRecord) => {
    router.navigate({
      pathname: '/artists-alley/moderate/[id]',
      params: { id: item.Id },
    })
  }, [])

  if (!loggedIn || !isPrivileged) return <Redirect href="/artists-alley" />

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header>{t('header_moderate')}</Header>
      <ArtistsAlleySectionedList leader={leader} items={items} onPress={onPress} />
    </View>
  )
}
