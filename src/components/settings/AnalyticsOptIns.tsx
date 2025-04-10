import React from 'react'
import Checkbox from 'expo-checkbox'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SettingContainer } from './SettingContainer'
import { Label } from '@/components/generic/atoms/Label'
import { Col } from '@/components/generic/containers/Col'
import { useCache } from '@/context/data/Cache'

/**
 * Analytics opt-in section with a checkbox to allow analytics.
 */
export const AnalyticsOptIns = () => {
    const { t } = useTranslation('Settings')
    const { getValue, setValue } = useCache()
    const settings = getValue('settings')

    const analyticsEnabled = settings.analyticsEnabled ?? false

    const setAnalytics = (enabled: boolean) =>
        setValue('settings', {
            ...settings,
            analyticsEnabled: enabled,
        })


    return (
        <SettingContainer>
            <TouchableOpacity style={styles.container} onPress={() => setAnalytics(!analyticsEnabled)} delayLongPress={1000}>
                <Col style={styles.column}>
                    <Label variant="bold">{t('allowAnalytics')}</Label>
                    <Label variant="narrow">{t('allowAnalyticsSubtitle')}</Label>
                </Col>

                <Checkbox value={analyticsEnabled} />
            </TouchableOpacity>
        </SettingContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flex: 1,
    },
})
