import { router } from 'expo-router'
import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Icon } from '../generic/atoms/Icon'

export interface DrawerProps {
    location: string;
    title?: string;
    swipeEnabled?: boolean;
    headerShown?: boolean;
    headerLargeTitle?: boolean;
    headerLeft?: React.ReactNode;
    headerRight?: React.ReactNode;
}

const goBackCustom = () => {
    return (
        <TouchableOpacity onPress={router.back}>
            <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
    )
}

export const useDrawerScreensData = (): DrawerProps[] => {
    const { t } = useTranslation('Menu')

    return [
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
            location: 'dealers/[dealerId]/index',
            title: t('dealers'),
            headerLeft: goBackCustom(),
            headerShown: false,
        },
        {
            location: 'events/[eventId]/index',
            title: t('events'),
            headerLeft: goBackCustom(),
            headerShown: false,
        },
        {
            location: 'knowledge/[knowledgeId]/index',
            title: t('info'),
            headerLeft: goBackCustom(),
            headerShown: false,
        },
        {
            location: 'profile/index',
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
            location: 'messages/[messageId]/index',
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
            location: 'settings/reveal/index',
            title: t('settings'),
            headerLeft: goBackCustom(),
            headerShown: false,
        },
        {
            location: '+not-found',
            headerShown: false,
        },
    ]
}
