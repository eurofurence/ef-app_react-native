import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalSearchParams } from 'expo-router'
import { DealersSectionedList } from '@/components/dealers/DealersSectionedList'
import { Badge } from '@/components/generic/containers/Badge'
import { Label } from '@/components/generic/atoms/Label'
import { conName } from '@/configuration'
import { useDealerGroups } from '@/components/dealers/Dealers.common'
import { useNow } from '@/hooks/time/useNow'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useCache } from '@/context/data/Cache'

export default function AllScreen() {
  const { query } = useLocalSearchParams<{ query?: string }>()
  const { t } = useTranslation('Dealers')
  const now = useNow()

  const { dealers, searchDealers } = useCache()
  const search = useFuseResults(searchDealers, query ?? '')
  const groups = useDealerGroups(now, search ?? dealers)

  return (
    <DealersSectionedList
      dealersGroups={groups}
      leader={
        <>
          <Badge unpad={0} badgeColor="lighten" textColor="text" textType="regular">
            {t('section_notice')}
          </Badge>
          <Label type="lead" variant="middle" mt={30}>
            {t('dealers_at_convention', { convention: conName })}
          </Label>
        </>
      }
    />
  )
}
