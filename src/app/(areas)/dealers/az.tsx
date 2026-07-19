import {DealersView} from "@/app/(areas)/dealers/all";
import {dealersFullCollection} from "@/data/collections/content/DealersFull";
import {collectBy} from "@/util/arrays";
import {inArray, or, useLiveQuery} from "@tanstack/react-db";
import {useMemo} from "react";
import { useTranslation } from 'react-i18next'
import { conName } from '@/configuration'
import { useDealersSearch } from '@/context/DealersSearchContext'

export default function AzScreen() {
  const {results} = useDealersSearch()
  const {t} = useTranslation('Dealers')

  const {data: dealers} = useLiveQuery({
    id: 'area-dealers-az',
    query: q => q.from({item: dealersFullCollection})
      .where(({item}) => or(!results, inArray(item.Id, results)))
  }, [results])

  const grouping = useMemo(() => {
    return collectBy(dealers, a => a.DisplayName.substring(0, 1).toUpperCase() || '_')
  }, [dealers])

  return <DealersView
    grouping={grouping}
    title={t('dealers_at_convention', {convention: conName})}
    icon="bookmark"/>
}
