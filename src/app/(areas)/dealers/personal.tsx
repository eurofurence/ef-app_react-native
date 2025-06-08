import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalSearchParams } from 'expo-router'
import { Label } from '@/components/generic/atoms/Label'
import { useDealerLocationGroups } from '@/components/dealers/Dealers.common'
import { useNow } from '@/hooks/time/useNow'
import { DealersSectionedList } from '@/components/dealers/DealersSectionedList'
import { useCache } from '@/context/data/Cache'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { Avatar } from '@/components/profile/Avatar'
import { Row } from '@/components/generic/containers/Row'

export default function PersonalScreen() {
  const { query } = useLocalSearchParams<{ query?: string }>()
  const { t } = useTranslation('Dealers')
  const now = useNow()

  const { dealersFavorite, searchDealersFavorite } = useCache()
  const search = useFuseResults(searchDealersFavorite, query ?? '')
  const groups = useDealerLocationGroups(t, now, search ?? dealersFavorite)

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
        <Label type="para" mt={20} ml={20} mr={20} variant="middle">
          {t('favorites_empty')}
        </Label>
      }
    />
  )
}
