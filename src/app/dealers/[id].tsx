import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'

import { appStyles } from '@/components/AppStyles'
import { DealerContent } from '@/components/dealers/DealerContent'
import { shareDealer } from '@/components/dealers/Dealers.common'
import { platformShareIcon } from '@/components/generic/atoms/Icon'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { useCache } from '@/context/data/Cache'
import { useUpdateSinceNote } from '@/hooks/data/useUpdateSinceNote'
import { useLatchTrue } from '@/hooks/util/useLatchTrue'

export default function DealerItem() {
  const { t } = useTranslation('Dealer')
  const { id } = useLocalSearchParams<{ id: string }>()
  const { dealers } = useCache()
  const dealer = dealers.dict[id]

  // Get update note. Latch so it's displayed even if reset in background.
  const updated = useUpdateSinceNote(dealer)
  const showUpdated = useLatchTrue(updated)

  const dealerName = dealer?.DisplayNameOrAttendeeNickname ?? t('viewing_dealer')

  return (
    <ScrollView
      style={StyleSheet.absoluteFill}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll
      accessibilityLabel={t('accessibility.page_description')}
      accessibilityHint={t('accessibility.scroll_view_hint')}
    >
      <Header secondaryIcon={platformShareIcon} secondaryPress={() => dealer && shareDealer(dealer)}>
        {dealerName}
      </Header>
      <Floater contentStyle={appStyles.trailer}>{!dealer ? null : <DealerContent dealer={dealer} parentPad={padFloater} updated={showUpdated} />}</Floater>
    </ScrollView>
  )
}
