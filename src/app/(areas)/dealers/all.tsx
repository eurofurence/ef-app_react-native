import { useTranslation } from 'react-i18next'

import { useDealerGroups } from '@/components/dealers/Dealers.common'
import { DealersSectionedList } from '@/components/dealers/DealersSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { Badge } from '@/components/generic/containers/Badge'
import { conName } from '@/configuration'
import { useDealersSearch } from '@/context/DealersSearchContext'
import { useCache } from '@/context/data/Cache'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useNow } from '@/hooks/time/useNow'

export default function AllScreen() {
  const { query } = useDealersSearch()
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
          <Badge
            unpad={0}
            badgeColor='lighten'
            textColor='text'
            textType='regular'
          >
            {t('section_notice')}
          </Badge>
          <Label type='lead' variant='middle' className='mt-8'>
            {t('dealers_at_convention', { convention: conName })}
          </Label>
        </>
      }
    />
  )
}
