import { captureException } from '@sentry/react-native'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native'
import { ScrollView, RefreshControl } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '@/components/AppStyles'
import { ProfileContent } from '@/components/ProfileContent'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { useAuthContext } from '@/context/auth/Auth'
import { useThemeColor, useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useCache } from '@/context/data/Cache'
import { Header } from '@/components/generic/containers/Header'
import { useTranslation } from 'react-i18next'
import { vibrateAfter } from '@/util/vibrateAfter'

export default function Profile() {
  const { refresh, loggedIn, claims, user } = useAuthContext()
  const [isReloading, setIsReloading] = useState(false)
  const spinValue = useMemo(() => new Animated.Value(0), [])
  const themeColor = useThemeColor('text')
  const iconColor = themeColor.color
  const { synchronize, isSynchronizing } = useCache()
  const backgroundStyle = useThemeBackground('background')
  const { t } = useTranslation('Profile')

  // Set up the rotation animation
  useEffect(() => {
    if (isReloading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start()
    } else {
      spinValue.setValue(0)
    }
  }, [isReloading, spinValue])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const doReload = useCallback(() => {
    if (!isReloading) {
      setIsReloading(true)
      refresh()
        .catch(captureException)
        .finally(() => {
          setIsReloading(false)
        })
    }
  }, [refresh, isReloading])

  // Navigate back if not logged in or unable to retrieve proper user data
  useEffect(() => {
    if (!loggedIn) {
      router.back()
    }
  }, [loggedIn])

  const refreshButton = useMemo(
    () => (
      <TouchableOpacity onPress={doReload} style={styles.refreshButton} activeOpacity={0.6}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="refresh" size={24} color={iconColor} />
        </Animated.View>
      </TouchableOpacity>
    ),
    [doReload, spin, iconColor]
  )

  return (
    <ScrollView
      style={[StyleSheet.absoluteFill, backgroundStyle]}
      refreshControl={<RefreshControl refreshing={isSynchronizing} onRefresh={() => vibrateAfter(synchronize())} />}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll
    >
      <Header secondaryIcon="refresh" secondaryPress={isReloading ? () => undefined : doReload} loading={isReloading}>
        {t('header')}
      </Header>
      <Floater contentStyle={appStyles.trailer}>{!claims || !user ? null : <ProfileContent claims={claims} user={user} parentPad={padFloater} />}</Floater>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  refreshButton: {
    padding: 8,
    marginRight: 8,
  },
})
