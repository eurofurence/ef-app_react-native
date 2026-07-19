import { inArray, or, useLiveQuery } from '@tanstack/react-db'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DealersView } from '@/app/(areas)/dealers/all'
import { useDealersSearch } from '@/context/DealersSearchContext'
import { dealersFullCollection } from '@/data/collections/content/DealersFull'
import { deriveDealerSection } from '@/data/utils/deriveDealerSection'
import { collectBy } from '@/util/arrays'

export default function AdScreen() {
  const { results } = useDealersSearch()
  const { t } = useTranslation('Dealers')

  const { data: dealers } = useLiveQuery(
    {
      id: 'area-dealers-ad',
      query: (q) =>
        q
          .from({ item: dealersFullCollection })
          .where(({ item }) => item.IsAfterDark)
          .where(({ item }) => or(!results, inArray(item.Id, results)))
          .orderBy(({ item }) => item.DisplayName),
    },
    [results]
  )

  const grouping = useMemo(() => {
    return collectBy(dealers, (a) => deriveDealerSection(a) ?? '')
  }, [dealers])

  return (
    <DealersView grouping={grouping} title={t('dealers_in_ad')} icon='desk' />
  )
}
