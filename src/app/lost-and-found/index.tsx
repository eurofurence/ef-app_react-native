import {EfList} from "@/components/generic/lists/EfLists";
import {LostAndFoundCard} from "@/components/lost-and-found/LostAndFoundCard";
import {lostAndFoundCollection} from "@/data/collections/content/LostAndFound";
import {synchronize, useIsSynchronizing} from "@/data/hooks/useSynchronize";
import type {EfLostAndFound} from "@/data/types/EfLostAndFound";
import {vibrateAfter} from "@/util/vibrateAfter";
import {ilike, inArray, or, useLiveQuery} from "@tanstack/react-db";
import {router} from "expo-router";
import {useRef, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import {
  ComboModal,
  type ComboModalRef,
} from '@/components/generic/atoms/ComboModal'
import { Label } from '@/components/generic/atoms/Label'
import { Search } from '@/components/generic/atoms/Search'
import { Button } from '@/components/generic/containers/Button'
import { Header } from '@/components/generic/containers/Header'
import { NoData } from '@/components/generic/containers/NoData'
import { Row } from '@/components/generic/containers/Row'

function onPressItem(item: EfLostAndFound) {
  router.navigate({
    pathname: '/lost-and-found/[id]',
    params: {id: item.Id},
  })
}

export default function LostAndFoundPage() {
  const {t} = useTranslation('LostAndFound')

  const isSynchronizing = useIsSynchronizing()
  const [search, setSearch] = useState<string>('')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const modalRef = useRef<ComboModalRef<string> | null>(null)

  const term = search.trim().toLowerCase()
  const {data: items, isLoading, isError} = useLiveQuery({
      id: 'lost-and-found',
      query: q => q.from({item: lostAndFoundCollection})
        .where(({item}) =>
          or(
            selectedStatuses.length === 0,
            inArray(item.Status, selectedStatuses)))
        .where(({item}) =>
          or(
            term.length === 0,
            ilike(item.Title, `%${term}%`),
            ilike(item.Description, `%${term}%`)))
        .orderBy(({item}) => item.LastChangeDateTimeUtc, {direction: "desc"})
    },
    [selectedStatuses, term])

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

  if (isError) {
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
      <Search className='mx-2.5' filter={search} setFilter={setSearch}/>

      <Row
        variant='start'
        style={{paddingHorizontal: 10, gap: 8, alignItems: 'center'}}
      >
        <Button
          onPress={async () => {
            const options = ['Lost', 'Found']
            const res = await modalRef.current?.pick(
              options,
              selectedStatuses ?? []
            )
            setSelectedStatuses(res ?? [])
          }}
          containerStyle={{flex: 0}}
          style={{flex: 0}}
        >
          {t('filters')}
        </Button>
      </Row>

      <ComboModal<string>
        ref={modalRef}
        title={t('filter_statuses')}
        getKey={(item) => item}
        getLabel={(item) => item}
      >
        <Label type='para'>{t('select_statuses')}</Label>
      </ComboModal>

      <EfList
        refreshing={isSynchronizing}
        onRefresh={() => vibrateAfter(synchronize())}
        scrollEnabled={true}
        contentContainerClassName="pb-32"
        data={items}
        renderItem={({item}) => {
          return <LostAndFoundCard containerStyle={styles.item} item={item} onPress={onPressItem}/>;
        }}
        accessibilityLabel={t('accessibility.lost_found_list')}
        accessibilityHint={t('accessibility.lost_found_list_hint')}/>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
  },
})
