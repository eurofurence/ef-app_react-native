import { router } from 'expo-router'
import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { Icon } from '@/components/generic/atoms/Icon'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export type StackScreenProps = NativeStackNavigationOptions & {
  location: string
  swipeEnabled?: boolean
}

const CustomBack = () => {
  return (
    <TouchableOpacity onPress={router.back}>
      <Icon name="arrow-left" size={24} color="black" />
    </TouchableOpacity>
  )
}

/**
 * Hok returning the stack screen data, including translations.
 */
export function useStackScreensData(): StackScreenProps[] {
  const { t } = useTranslation('Menu')

  return useMemo(
    () => [
      {
        location: '(areas)',
        headerShown: false,
        title: t('home'),
      },
      {
        location: 'knowledge/index',
        title: t('info'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'artists-alley/[id]',
        title: t('artist_alley'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'artists-alley/index',
        title: t('artist_alley'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'artists-alley/reg',
        title: t('artist_alley'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'auth/login',
      },
      {
        location: 'dealers/[id]',
        title: t('dealers'),
        headerLeft: CustomBack,
        headerShown: false,
      },
      {
        location: 'events/[id]/index',
        title: t('events'),
        headerLeft: CustomBack,
        headerShown: false,
      },
      {
        location: 'events/[id]/feedback',
        title: t('events'),
        headerLeft: CustomBack,
        headerShown: false,
      },
      {
        location: 'announcements/[id]',
        title: t('announcements'),
        headerLeft: CustomBack,
        headerShown: false,
      },
      {
        location: 'announcements/index',
        title: t('announcements'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'images/[id]',
        title: t('image'),
        headerLeft: CustomBack,
        headerShown: false,
      },
      {
        location: 'images/web',
        title: t('image'),
        headerLeft: CustomBack,
        headerShown: false,
      },
      {
        location: 'knowledge/[id]',
        title: t('info'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'profile',
        title: t('profile'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'maps/[...slug]',
        headerLeft: CustomBack,
        headerShown: false,
      },
      {
        location: 'messages/index',
        title: t('pm'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'messages/compose',
        title: t('pm'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'messages/[id]',
        title: t('pm'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'settings/index',
        title: t('settings'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'settings/reveal',
        title: t('settings'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'about',
        title: t('about'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'lost-and-found/index',
        title: t('lost_and_found'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: 'lost-and-found/[id]',
        title: t('lost_and_found'),
        headerLeft: CustomBack,
        headerShown: false,
        swipeEnabled: true,
      },
      {
        location: '+not-found',
        headerShown: false,
      },
    ],
    [t]
  )
}
