import {hiddenEventsClear} from "@/data/collections/supplemental/HiddenEvents";
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { Section } from '@/components/generic/atoms/Section'
import { Button } from '@/components/generic/containers/Button'

import { SettingContainer } from './SettingContainer'


export const HiddenEvents = () => {
  const { t } = useTranslation('Settings', { keyPrefix: 'hidden_events' })

  return (
    <SettingContainer>
      <Section title={t('title')} subtitle={t('subtitle')} icon='monitor-eye' />

      <Button
        containerStyle={styles.button}
        icon='folder-eye'
        onPress={hiddenEventsClear}
      >
        {t('unhide_all')}
      </Button>
      <Button
        containerStyle={styles.button}
        icon='eye'
        onPress={() => router.push('/settings/reveal')}
      >
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
