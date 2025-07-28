import { useDealerGroups } from '@/components/dealers/Dealers.common'
import { DealersSectionedList } from '@/components/dealers/DealersSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { Badge } from '@/components/generic/containers/Badge'
import { useCache } from '@/context/data/Cache'
import { useDealersSearch } from '@/context/DealersSearchContext'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useNow } from '@/hooks/time/useNow'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export default function AdScreen() {
  const { query } = useDealersSearch()
  const { t } = useTranslation('Dealers')
  const now = useNow()

  const { dealersInAfterDark, searchDealersInAfterDark } = useCache()
  const search = useFuseResults(searchDealersInAfterDark, query ?? '')
  const groups = useDealerGroups(now, search ?? dealersInAfterDark)

  return (
    <DealersSectionedList
      dealersGroups={groups}
      leader={
        <>
          <Badge unpad={0} badgeColor="lighten" textColor="text" textType="regular">
            {t('section_notice')}
          </Badge>
          <Label type="lead" variant="middle" mt={30}>
            {t('dealers_in_ad')}
          </Label>
        </>
      }
    />
  )
}
