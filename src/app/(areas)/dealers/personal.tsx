import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useDealerGroups } from '@/components/dealers/Dealers.common'
import { DealersSectionedList } from '@/components/dealers/DealersSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { Row } from '@/components/generic/containers/Row'
import { Avatar } from '@/components/profile/Avatar'
import { useCache } from '@/context/data/Cache'
import { useDealersSearch } from '@/context/DealersSearchContext'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useNow } from '@/hooks/time/useNow'

export default function PersonalScreen() {
  const { query } = useDealersSearch()
  const { t } = useTranslation('Dealers')
  const now = useNow()

  const { dealersFavorite, searchDealersFavorite } = useCache()
  const search = useFuseResults(searchDealersFavorite, query ?? '')
  const groups = useDealerGroups(now, search ?? dealersFavorite)

  return (
    <DealersSectionedList
      dealersGroups={groups}
      leader={
        <Row type="center" variant="center" gap={10}>
          <Avatar />
          <Label type="lead" variant="middle">
            {t('favorites_title')}
          </Label>
        </Row>
      }
      empty={
        <Label type="para" className="mt-5 ml-5 mr-5" variant="middle">
          {t('favorites_empty')}
        </Label>
      }
    />
  )
}
