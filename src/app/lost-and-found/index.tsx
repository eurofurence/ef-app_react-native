import { FC, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { ComboModal, ComboModalRef } from '@/components/generic/atoms/ComboModal'
import { Label } from '@/components/generic/atoms/Label'
import { Search } from '@/components/generic/atoms/Search'
import { Button } from '@/components/generic/containers/Button'
import { Header } from '@/components/generic/containers/Header'
import { NoData } from '@/components/generic/containers/NoData'
import { Row } from '@/components/generic/containers/Row'
import { LostAndFoundList } from '@/components/lost-and-found/LostAndFoundList'
import { sortByDate } from '@/components/lost-and-found/utils'
import { useLostAndFoundQuery } from '@/hooks/api/lost-and-found/useLostAndFoundQuery'

export default function LostAndFoundPage() {
  return <LostAndFoundContent />
}

const LostAndFoundContent: FC = () => {
  const { t } = useTranslation('LostAndFound')
  const { data: items, isLoading, error } = useLostAndFoundQuery()

  const [search, setSearch] = useState<string>('')
  // empty array => all
  const [selectedStatuses, setSelectedStatuses] = useState<readonly string[]>([])
  const modalRef = useRef<ComboModalRef<string> | null>(null)

  const filtered = useMemo(() => {
    if (!items) return []
    // Filter by status first
    const byStatus = selectedStatuses.length === 0 ? items : items.filter((it) => selectedStatuses.includes(it.Status))
    // Filter by search term (title or description)
    const term = search.trim().toLowerCase()
    const bySearch = term ? byStatus.filter((it) => (it.Title || '').toLowerCase().includes(term) || (it.Description || '').toLowerCase().includes(term)) : byStatus
    return sortByDate(bySearch)
  }, [items, search, selectedStatuses])

  if (isLoading) {
    return (
      <View style={StyleSheet.absoluteFill} accessibilityLabel={t('accessibility.main_container')}>
        <Header>{t('header')}</Header>
        <NoData text={t('loading')} accessibilityLabel={t('accessibility.loading_state')} accessibilityHint={t('accessibility.loading_state_hint')} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={StyleSheet.absoluteFill} accessibilityLabel={t('accessibility.main_container')}>
        <Header>{t('header')}</Header>
        <NoData text={t('error_loading')} accessibilityLabel={t('accessibility.error_state')} accessibilityHint={t('accessibility.error_state_hint')} />
      </View>
    )
  }

  if (!items || items.length === 0) {
    return (
      <View style={StyleSheet.absoluteFill} accessibilityLabel={t('accessibility.main_container')}>
        <Header>{t('header')}</Header>
        <NoData text={t('no_items')} accessibilityLabel={t('accessibility.empty_state')} accessibilityHint={t('accessibility.empty_state_hint')} />
      </View>
    )
  }

  return (
    <View style={StyleSheet.absoluteFill} accessibilityLabel={t('accessibility.main_container')}>
      <Header>{t('header')}</Header>
      <Search className="mx-2.5" filter={search} setFilter={setSearch} />

      <Row variant="start" style={{ paddingHorizontal: 10, gap: 8, alignItems: 'center' }}>
        <Button
          onPress={async () => {
            const options = ['Lost', 'Found']
            const res = await modalRef.current?.pick(options, selectedStatuses ?? [])
            setSelectedStatuses(res ?? [])
          }}
          containerStyle={{ flex: 0 }}
          style={{ flex: 0 }}
        >
          {t('filters')}
        </Button>
      </Row>

      <ComboModal<string> ref={modalRef} title={t('filter_statuses')} getKey={(item) => item} getLabel={(item) => item}>
        <Label type="para">{t('select_statuses')}</Label>
      </ComboModal>

      <LostAndFoundList items={filtered} />
    </View>
  )
}
