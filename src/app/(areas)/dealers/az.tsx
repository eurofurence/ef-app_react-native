import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalSearchParams } from 'expo-router'
import { useNow } from '@/hooks/time/useNow'
import { useDealerAlphabeticalGroups } from '@/components/dealers/Dealers.common'
import { DealersSectionedList } from '@/components/dealers/DealersSectionedList'
import { Label } from '@/components/generic/atoms/Label'
import { conName } from '@/configuration'
import { useFuseResults } from '@/hooks/searching/useFuseResults'
import { useCache } from '@/context/data/Cache'

export default function AllScreen() {
    const { query } = useLocalSearchParams<{ query?: string }>()
    const { t } = useTranslation('Dealers')
    const now = useNow()

    const { dealers, searchDealers } = useCache()
    const search = useFuseResults(searchDealers, query ?? '')
    const groups = useDealerAlphabeticalGroups(t, now, search ?? dealers.values)

    return (
        <DealersSectionedList
            dealersGroups={groups}
            leader={
                <>
                    <Label type="lead" variant="middle" mt={30}>
                        {t('dealers_at_convention', { convention: conName })}
                    </Label>
                </>
            }
        />
    )
}
