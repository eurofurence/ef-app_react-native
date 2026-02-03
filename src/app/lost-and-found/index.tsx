import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Header } from '@/components/generic/containers/Header'
import { NoData } from '@/components/generic/containers/NoData'
import { LostAndFoundList } from '@/components/lost-and-found/LostAndFoundList'
import { useLostAndFoundQuery } from '@/hooks/api/lost-and-found/useLostAndFoundQuery'

export default function LostAndFoundPage() {
  return <LostAndFoundContent />
}

const LostAndFoundContent: FC = () => {
  const { t } = useTranslation('LostAndFound')
  const { data: items, isLoading, error } = useLostAndFoundQuery()

  if (isLoading) {
    return (
      <View
        style={StyleSheet.absoluteFill}
        accessibilityLabel={t('accessibility.main_container')}
      >
        <Header>{t('header')}</Header>
        <NoData
          text={t('loading')}
          accessibilityLabel={t('accessibility.loading_state')}
          accessibilityHint={t('accessibility.loading_state_hint')}
        />
      </View>
    )
  }

  if (error) {
    return (
      <View
        style={StyleSheet.absoluteFill}
        accessibilityLabel={t('accessibility.main_container')}
      >
        <Header>{t('header')}</Header>
        <NoData
          text={t('error_loading')}
          accessibilityLabel={t('accessibility.error_state')}
          accessibilityHint={t('accessibility.error_state_hint')}
        />
      </View>
    )
  }

  if (!items || items.length === 0) {
    return (
      <View
        style={StyleSheet.absoluteFill}
        accessibilityLabel={t('accessibility.main_container')}
      >
        <Header>{t('header')}</Header>
        <NoData
          text={t('no_items')}
          accessibilityLabel={t('accessibility.empty_state')}
          accessibilityHint={t('accessibility.empty_state_hint')}
        />
      </View>
    )
  }

  return (
    <View
      style={StyleSheet.absoluteFill}
      accessibilityLabel={t('accessibility.main_container')}
    >
      <Header>{t('header')}</Header>
      <LostAndFoundList items={items} />
    </View>
  )
}
