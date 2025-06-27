import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { Redirect, router } from 'expo-router'
import React, { useMemo } from 'react'
import { useArtistsAlleyAllQuery } from '@/hooks/api/artists-alley/useArtistsAlleyAllQuery'
import { StyleSheet, View } from 'react-native'
import { Header } from '@/components/generic/containers/Header'
import { useTranslation } from 'react-i18next'
import { useAuthContext } from '@/context/auth/Auth'
import { Button } from '@/components/generic/containers/Button'
import { artistsAlleySectionForState, ArtistsAlleySectionProps } from '@/components/artists-alley/ArtistsAlleySection'
import { ArtistsAlleySectionedList } from '@/components/artists-alley/ArtistsAlleySectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { useNow } from '@/hooks/time/useNow'
import { TableRegistrationInstance, tableRegistrationInstanceForAny } from '@/components/artists-alley/ArtistsAlleyCard'

export default function List() {
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'list' })
  const { loggedIn } = useAuthContext()
  const { data: user } = useUserSelfQuery()
  const { data: source } = useArtistsAlleyAllQuery()

  const now = useNow()

  const items = useMemo((): (ArtistsAlleySectionProps | TableRegistrationInstance)[] => {
    if (!source) return []
    const pending = []
    const accepted = []
    const published = []
    const rejected = []
    for (const item of source) {
      const instance = tableRegistrationInstanceForAny(item, now)
      if (instance.visibility === 'hidden') continue
      if (item.State === 'Pending') pending.push(instance)
      else if (item.State === 'Accepted') accepted.push(instance)
      else if (item.State === 'Published') published.push(instance)
      else if (item.State === 'Rejected') rejected.push(instance)
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
  }, [source, t, now])

  const rolesAvailable = Boolean(user?.RoleMap)
  const isAdmin = Boolean(user?.RoleMap?.Admin)
  const isArtistAlleyAdmin = Boolean(user?.RoleMap?.ArtistAlleyAdmin)
  const isArtistAlleyModerator = Boolean(user?.RoleMap?.ArtistAlleyModerator)
  // Get roles for preemptive RBAC.
  const isAttending = Boolean(user?.RoleMap?.Attendee)
  const isCheckedIn = Boolean(user?.RoleMap?.AttendeeCheckedIn)

  const leader = useMemo(() => {
    return (
      <>
        <Label type="lead" variant="middle" mt={30}>
          {t('moderate')}
        </Label>
        {!loggedIn && !isAttending && !isCheckedIn ? null : (
          <Button containerStyle={styles.registerSelf} onPress={() => router.navigate('/artists-alley/reg')} outline={true}>
            {t('register_self')}
          </Button>
        )}
      </>
    )
  }, [isAttending, isCheckedIn, loggedIn, t])

  if (!loggedIn) return <Redirect href="/artists-alley/reg" />
  if (rolesAvailable && !isAdmin && !isArtistAlleyAdmin && !isArtistAlleyModerator) return <Redirect href="/artists-alley/reg" />

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header>{t('header')}</Header>
      <ArtistsAlleySectionedList leader={leader} items={items} />
    </View>
  )
}

const styles = StyleSheet.create({
  registerSelf: {
    margin: 20,
  },
})
