import { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { LostAndFoundList } from '@/components/lost-and-found/LostAndFoundList'
import { NoData } from '@/components/generic/containers/NoData'
import { useLostAndFoundAllQuery } from '@/hooks/api/lost-and-found/useLostAndFoundAllQuery'
import { Header } from '@/components/generic/containers/Header'

export default function LostAndFoundPage() {
  return <LostAndFoundContent />
}

const LostAndFoundContent: FC = () => {
  const { t } = useTranslation('LostAndFound')
  const { data: items, isLoading, error } = useLostAndFoundAllQuery()

  if (isLoading) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Header>{t('header')}</Header>
        <NoData text={t('loading')} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Header>{t('header')}</Header>
        <NoData text={t('error_loading')} />
      </View>
    )
  }

  if (!items || items.length === 0) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Header>{t('header')}</Header>
        <NoData text={t('no_items')} />
      </View>
    )
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header>{t('header')}</Header>
      <LostAndFoundList items={items} />
    </View>
  )
}
