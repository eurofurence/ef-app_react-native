import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { Redirect, router } from 'expo-router'
import React, { useCallback, useEffect, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Header } from '@/components/generic/containers/Header'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/generic/containers/Button'
import { ArtistsAlleySectionedList } from '@/components/artists-alley/ArtistsAlleySectionedList'
import { useCache } from '@/context/data/Cache'
import { TableRegistrationRecord } from '@/context/data/types.api'
import { ArtistAlleyDetails } from '@/context/data/types.details'
import { useAuthContext } from '@/context/auth/Auth'
import { Label } from '@/components/generic/atoms/Label'
import { useIsFocused } from '@react-navigation/core'

export default function List() {
  const { t } = useTranslation('ArtistsAlley')
  const { loggedIn } = useAuthContext()
  const { data: user } = useUserSelfQuery()
  const { artistAlley, synchronize } = useCache()

  // Get roles for preemptive RBAC.
  const isPrivileged = Boolean(user?.RoleMap?.Admin) || Boolean(user?.RoleMap?.ArtistAlleyAdmin) || Boolean(user?.RoleMap?.ArtistAlleyModerator)
  const isCheckedIn = Boolean(user?.RoleMap?.AttendeeCheckedIn)

  // Sync on focus, artist alley data might change more frequently than other parts of the app.
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) synchronize().catch(console.error)
  }, [isFocused, synchronize])

  const leader = useMemo(() => {
    return (
      <View className="m-5 gap-4">
        <Label type="compact">{t('intro')}</Label>

        {!isCheckedIn ? null : (
          <Button icon="application-edit-outline" onPress={() => router.navigate('/artists-alley/reg')}>
            {t('list.register_self')}
          </Button>
        )}
        {!isPrivileged ? null : (
          <Button icon="shield-plus-outline" onPress={() => router.navigate('/artists-alley/moderate')}>
            {t('list.moderate')}
          </Button>
        )}
      </View>
    )
  }, [isPrivileged, isCheckedIn, t])

  const empty = useMemo(
    () => (
      <Label type="para" className="mx-5" variant="middle">
        {isCheckedIn ? t('list.artists_alley_empty_checked_in') : t('list.artists_alley_empty')}
      </Label>
    ),
    [isCheckedIn, t]
  )
  const onPress = useCallback((item: ArtistAlleyDetails | TableRegistrationRecord) => {
    router.navigate({
      pathname: '/artists-alley/[id]',
      params: { id: item.Id },
    })
  }, [])

  if (!loggedIn || (!isCheckedIn && !isPrivileged)) return <Redirect href="/artists-alley/reg" />

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header>{t('list.header')}</Header>
      <ArtistsAlleySectionedList items={[...artistAlley]} onPress={onPress} leader={leader} empty={empty} />
    </View>
  )
}
