import React from 'react'
import Checkbox from 'expo-checkbox'
import { noop } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet } from 'react-native'
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

    const setDevMenu = (enabled: boolean) =>
        setValue('settings', {
            ...settings,
            devMenu: enabled,
        })

    return (
        <SettingContainer>
            <TouchableOpacity
                style={styles.container}
                onPress={() => setAnalytics(!analyticsEnabled)}
                onLongPress={() =>
                    Alert.alert(t('developer_settings_alert.title'), t('developer_settings_alert.body'), [
                        {
                            text: t('developer_settings_alert.cancel'),
                            onPress: noop,
                            style: 'cancel',
                        },
                        {
                            text: t('developer_settings_alert.disable'),
                            onPress: () => setDevMenu(false),
                            style: 'default',
                        },
                        {
                            text: t('developer_settings_alert.enable'),
                            onPress: () => setDevMenu(true),
                            style: 'destructive',
                        },
                    ])
                }
                delayLongPress={1000}
            >
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
