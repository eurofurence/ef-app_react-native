import {DealerCard2} from "@/components/dealers/DealerCard2";
import {DealerSection} from "@/components/dealers/DealerSection";
import type {IconNames} from "@/components/generic/atoms/Icon";
import {EfSectionList} from "@/components/generic/lists/EfLists";
import {deriveDealerSection} from "@/data/utils/deriveDealerSection";
import {dealersFullCollection, type EfDealerFull} from "@/data/collections/content/DealersFull";
import {favoriteDealersToggle} from "@/data/collections/supplemental/FavoriteDealers";
import {synchronize, useIsSynchronizing} from "@/data/hooks/useSynchronize";
import {collectBy} from "@/util/arrays";
import {vibrateAfter} from "@/util/vibrateAfter";
import {inArray, or, useLiveQuery} from "@tanstack/react-db";
import {router} from "expo-router";
import {useMemo} from "react";
import { useTranslation } from 'react-i18next'

import { Label } from '@/components/generic/atoms/Label'
import { conName } from '@/configuration'
import { useDealersSearch } from '@/context/DealersSearchContext'
import {StyleSheet} from "react-native";

export function onPressDealer(dealer: EfDealerFull) {
  router.navigate({
    pathname: '/dealers/[id]',
    params: {id: dealer.Id},
  })
}

export function onLongPressDealer(dealer: EfDealerFull) {
  favoriteDealersToggle(dealer.Id)
}

export function DealersView({grouping, title, icon}: { grouping: (string | EfDealerFull)[], title: string, icon: IconNames }) {
  const {t} = useTranslation('Dealers')
  const isSynchronizing = useIsSynchronizing()

  const listHeaderComponent = <Label type='lead' variant='middle' className='mt-8'>
    {title}
  </Label>

  return <EfSectionList<string, EfDealerFull>
    refreshing={isSynchronizing}
    onRefresh={() => vibrateAfter(synchronize())}
    scrollEnabled={true}
    contentContainerClassName="pb-32"
    ListHeaderComponent={listHeaderComponent}
    data={grouping}
    renderSection={({item}) => {
      return <DealerSection
        style={styles.item}
        title={item === "" ? t('section_table_none') : t('section_table', {section: item})}
        backgroundColor='surface'
        icon={icon}
      />;
    }}
    renderItem={({item}) => {
      return <DealerCard2 containerStyle={styles.item} dealer={item} onPress={onPressDealer} onLongPress={onLongPressDealer}/>
    }}
    accessibilityLabel={t('accessibility.dealers_sectioned_list')}
    accessibilityHint={t('accessibility.dealers_sectioned_list_hint')}/>
}

export default function AllScreen() {
  const {results} = useDealersSearch()
  const { t } = useTranslation('Dealers')

  const {data: dealers} = useLiveQuery({
    id: 'area-dealers-all',
    query: q => q.from({item: dealersFullCollection})
      .where(({item}) => or(!results, inArray(item.Id, results)))
      .orderBy(({item}) => item.DisplayName)
  }, [results])

  const grouping = useMemo(() => {
    return collectBy(dealers, a => deriveDealerSection(a) ?? '')
  }, [dealers])

  return <DealersView
    grouping={grouping}
    title={t('dealers_at_convention', {convention: conName})}
    icon="desk"/>
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
  },
})
