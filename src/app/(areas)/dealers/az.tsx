import { useDealerAlphabeticalGroups } from '@/components/dealers/Dealers.common'
import { DealersSectionedList } from '@/components/dealers/DealersSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { conName } from '@/configuration'
import { useCache } from '@/context/data/Cache'
import { useDealersSearch } from '@/context/DealersSearchContext'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useNow } from '@/hooks/time/useNow'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export default function AzScreen() {
  const { query } = useDealersSearch()
  const { t } = useTranslation('Dealers')
  const now = useNow()

  const { dealers, searchDealers } = useCache()
  const search = useFuseResults(searchDealers, query ?? '')
  const groups = useDealerAlphabeticalGroups(now, search ?? dealers)

  return (
    <DealersSectionedList
      dealersGroups={groups}
      leader={
        <>
          <Label type="lead" variant="middle" className="mt-8">
            {t('dealers_at_convention', { convention: conName })}
          </Label>
        </>
      }
    />
  )
}
