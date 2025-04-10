import { router } from 'expo-router'
import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { Icon } from '@/components/generic/atoms/Icon'

export interface StackScreenProps {
  location: string
  title?: string
  swipeEnabled?: boolean
  headerShown?: boolean
  headerLargeTitle?: boolean
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
}

const goBackCustom = () => {
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
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'dealers/[id]',
        title: t('dealers'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'events/[id]/index',
        title: t('events'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'events/[id]/feedback',
        title: t('events'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'images/[id]',
        title: t('image'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'images/web',
        title: t('image'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'knowledge/[id]',
        title: t('info'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'profile',
        title: t('profile'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'maps/[...slug]',
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'messages/index',
        title: t('pm'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'messages/[messageId]',
        title: t('pm'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'settings/index',
        title: t('settings'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'settings/reveal',
        title: t('settings'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: 'about',
        title: t('about'),
        headerLeft: goBackCustom(),
        headerShown: false,
      },
      {
        location: '+not-found',
        headerShown: false,
      },
    ],
    [t]
  )
}
