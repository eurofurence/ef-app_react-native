﻿import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalSearchParams } from 'expo-router'
import { useNow } from '@/hooks/time/useNow'
import { useDealerGroups } from '@/components/dealers/Dealers.common'
import { DealersSectionedList } from '@/components/dealers/DealersSectionedList'
import { Badge } from '@/components/generic/containers/Badge'
import { Label } from '@/components/generic/atoms/Label'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useCache } from '@/context/data/Cache'

export default function RegularScreen() {
    const { query } = useLocalSearchParams<{ query?: string }>()
    const { t } = useTranslation('Dealers')
    const now = useNow()

    const { dealersInRegular, searchDealersInRegular } = useCache()
    const search = useFuseResults(searchDealersInRegular, query ?? '')
    const groups = useDealerGroups(t, now, search ?? dealersInRegular)

    return (
        <DealersSectionedList
            dealersGroups={groups}
            leader={
                <>
                    <Badge unpad={0} badgeColor="lighten" textColor="text" textType="regular">
                        {t('section_notice')}
                    </Badge>
                    <Label type="lead" variant="middle" mt={30}>
                        {t('dealers_in_regular')}
                    </Label>
                </>
            }
        />
    )
}
