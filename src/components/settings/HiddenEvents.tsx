import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { SettingContainer } from './SettingContainer'
import { Section } from '@/components/generic/atoms/Section'
import { Button } from '@/components/generic/containers/Button'
import { useCache } from '@/context/data/DataCache'

export const HiddenEvents = () => {
    const { t } = useTranslation('Settings', { keyPrefix: 'hidden_events' })
    const { getValue, setValue } = useCache()

    const unhideAllEvents = () =>
        setValue('settings', {
            ...(getValue('settings') ?? {}),
            hiddenEvents: [],
        })

    return (
        <SettingContainer>
            <Section title={t('title')} subtitle={t('subtitle')} icon="monitor-eye" />

            <Button containerStyle={styles.button} icon="folder-eye" onPress={unhideAllEvents}>
                {t('unhide_all')}
            </Button>
            <Button containerStyle={styles.button} icon="eye" onPress={() => router.push('/settings/reveal-hidden')}>
                {t('unhide_specific')}
            </Button>
        </SettingContainer>
    )
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
    },
})
