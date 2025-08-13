import React from 'react'
import { useTranslation } from 'react-i18next'
import { SettingContainer } from './SettingContainer'
import { Section } from '@/components/generic/atoms/Section'
import { Button } from '@/components/generic/containers/Button'
import { ReactNativeLegal } from 'react-native-legal'

export const OssLicenses = () => {
  const { t } = useTranslation('Settings', { keyPrefix: 'oss_licenses' })

  const launchNotice = () => {
    ReactNativeLegal.launchLicenseListScreen(t('list_title'))
  }

  return (
    <SettingContainer>
      <Section title={t('title')} subtitle={t('subtitle')} icon="license" />

      <Button className="my-1" onPress={launchNotice} icon="code-braces-box">
        {t('show_licenses')}
      </Button>
    </SettingContainer>
  )
}
