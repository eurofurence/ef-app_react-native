import {onLongPressDealer, onPressDealer} from "@/app/(areas)/dealers/all";
import {DealerCard2} from "@/components/dealers/DealerCard2";
import {DealerSection} from "@/components/dealers/DealerSection";
import {EfSectionList} from "@/components/generic/lists/EfLists";
import {deriveDealerSection} from "@/data/utils/deriveDealerSection";
import {dealersCollection} from "@/data/collections/content/Dealers";
import {dealersFullCollection, type EfDealerFull} from "@/data/collections/content/DealersFull";
import {collectBy} from "@/util/arrays";
import {inArray, isUndefined, not, or, useLiveQuery} from "@tanstack/react-db";
import {useMemo} from "react";
import { useTranslation } from 'react-i18next'

import { Label } from '@/components/generic/atoms/Label'
import { Row } from '@/components/generic/containers/Row'
import { Avatar } from '@/components/profile/Avatar'
import { useDealersSearch } from '@/context/DealersSearchContext'
import {StyleSheet} from "react-native";

export default function PersonalScreen() {
  const {results} = useDealersSearch()
  const {t} = useTranslation('Dealers')

  const {data: dealers, isLoading} = useLiveQuery({
    id: 'area-dealers-personal',
    query: q => q.from({item: dealersFullCollection})
      .where(({item}) => not(isUndefined(item.Favorite)))
      .where(({item}) => or(!results, inArray(item.Id, results)))
      .orderBy(({item}) => item.DisplayName)
  }, [results])

  const grouping = useMemo(() => {
    return collectBy(dealers, a => deriveDealerSection(a) ?? '')
  }, [dealers])

  const listHeaderComponent = <Row type='center' variant='center' gap={10}>
    <Avatar/>
    <Label type='lead' variant='middle'>
      {t('favorites_title')}
    </Label>
  </Row>

  const listEmptyComponent = <Label type='para' className='mt-5 ml-5 mr-5' variant='middle'>
    {t('favorites_empty')}
  </Label>

  return <EfSectionList<string, EfDealerFull>
    refreshing={isLoading}
    onRefresh={() => dealersCollection.utils.refetch()}
    scrollEnabled={true}
    contentContainerClassName="pb-32"
    ListHeaderComponent={listHeaderComponent}
    ListEmptyComponent={listEmptyComponent}
    data={grouping}
    renderSection={({item}) => {
      return <DealerSection
        style={styles.item}
        title={item === "" ? t('section_table_none') : t('section_table', {section: item})}
        backgroundColor='surface'
        icon="desk"
      />;
    }}
    renderItem={({item}) => {
      return <DealerCard2
        containerStyle={styles.item}
        dealer={item}
        onPress={onPressDealer}
        onLongPress={onLongPressDealer}/>
    }}
    accessibilityLabel={t('accessibility.dealers_sectioned_list')}
    accessibilityHint={t('accessibility.dealers_sectioned_list_hint')}/>
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
  },
})
