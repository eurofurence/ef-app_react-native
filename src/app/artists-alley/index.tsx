import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { Redirect, router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Header } from '@/components/generic/containers/Header'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/generic/containers/Button'
import { ArtistsAlleySectionedList } from '@/components/artists-alley/ArtistsAlleySectionedList'
import { useCache } from '@/context/data/Cache'
import { TableRegistrationRecord } from '@/context/data/types.api'
import { ArtistAlleyDetails } from '@/context/data/types.details'
import { useAuthContext } from '@/context/auth/Auth'

export default function List() {
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'list' })
  const { loggedIn } = useAuthContext()
  const { data: user } = useUserSelfQuery()
  const { artistAlley } = useCache()

  // Get roles for preemptive RBAC.
  const isPrivileged = Boolean(user?.RoleMap?.Admin) || Boolean(user?.RoleMap?.ArtistAlleyAdmin) || Boolean(user?.RoleMap?.ArtistAlleyModerator)
  const isCheckedIn = Boolean(user?.RoleMap?.AttendeeCheckedIn)

  const leader = useMemo(() => {
    return (
      <>
        {!isCheckedIn ? null : (
          <Button containerStyle={styles.registerSelf} onPress={() => router.navigate('/artists-alley/reg')} outline={true}>
            {t('register_self')}
          </Button>
        )}
        {!isPrivileged ? null : (
          <Button containerStyle={styles.registerSelf} onPress={() => router.navigate('/artists-alley/moderate')} outline={true}>
            {t('moderate')}
          </Button>
        )}
      </>
    )
  }, [isPrivileged, isCheckedIn, t])

  const onPress = useCallback((item: ArtistAlleyDetails | TableRegistrationRecord) => {
    router.navigate({
      pathname: '/artists-alley/[id]',
      params: { id: item.Id },
    })
  }, [])

  if (!loggedIn || (!isCheckedIn && !isPrivileged)) return <Redirect href="/artists-alley/reg" />

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header>{t('header')}</Header>
      <ArtistsAlleySectionedList leader={leader} items={[...artistAlley]} onPress={onPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  registerSelf: {
    margin: 20,
  },
})
