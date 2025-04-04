import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { SettingContainer } from './SettingContainer'
import { Section } from '@/components/generic/atoms/Section'
import { Button } from '@/components/generic/containers/Button'
import { useWarningState } from '@/hooks/data/useWarningState'

export const Warnings = () => {
    const { t } = useTranslation('Settings', { keyPrefix: 'device_warnings' })

    const deviceWarnings = useWarningState('deviceWarningsHidden')
    const languageWarnings = useWarningState('languageWarningsHidden')
    const timeZoneWarnings = useWarningState('timeZoneWarningsHidden')

    return (
        <SettingContainer>
            <Section title={t('title')} subtitle={t('subtitle')} icon="monitor-eye" />

            <Button
                containerStyle={styles.button}
                icon={deviceWarnings.isHidden ? 'eye' : 'eye-off'}
                onPress={deviceWarnings.isHidden ? deviceWarnings.showWarning : deviceWarnings.hideWarning}
            >
                {deviceWarnings.isHidden ? t('show_device_warnings') : t('hide_device_warnings')}
            </Button>

            <Button
                containerStyle={styles.button}
                icon={languageWarnings.isHidden ? 'eye' : 'eye-off'}
                onPress={languageWarnings.isHidden ? languageWarnings.showWarning : languageWarnings.hideWarning}
            >
                {languageWarnings.isHidden ? t('show_language_warnings') : t('hide_language_warnings')}
            </Button>

            <Button
                containerStyle={styles.button}
                icon={timeZoneWarnings.isHidden ? 'eye' : 'eye-off'}
                onPress={timeZoneWarnings.isHidden ? timeZoneWarnings.showWarning : timeZoneWarnings.hideWarning}
            >
                {timeZoneWarnings.isHidden ? t('show_time_zone_warnings') : t('hide_time_zone_warnings')}
            </Button>
        </SettingContainer>
    )
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
    },
})
